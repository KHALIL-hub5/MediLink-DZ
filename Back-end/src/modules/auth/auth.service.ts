import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserStatus } from "@prisma/client";

// @ts-ignore: Could not find a declaration file for module 'bcryptjs'.
import * as bcrypt from "bcryptjs";

import { createHash, randomBytes } from "node:crypto";

import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  // =========================================================
  // LOGIN
  // =========================================================

  async login(loginDto: LoginDto) {
    // 1. Normalize email
    const email = loginDto.email.toLowerCase().trim();

    // 2. Find user
    const user = await this.usersService.findByEmail(email);

    // Do not reveal whether the email exists
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 3. Check password
    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    // 4. Check account status
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(
        `Account is not active. Current status: ${user.status}`,
      );
    }

    // 5. Check whether account is temporarily locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException("Account is temporarily locked");
    }

    // 6. Generate access token
    const accessToken = await this.generateAccessToken(user);

    // 7. Generate refresh token A
    const refreshToken = randomBytes(32).toString("hex");

    // 8. Hash refresh token before storing it
    const tokenHash = this.hashRefreshToken(refreshToken);

    // 9. Refresh token expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 10. Store only the HASH in PostgreSQL
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // 11. Return access token + ORIGINAL refresh token
    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    };
  }

  // =========================================================
  // REFRESH TOKEN
  // =========================================================

  async refresh(refreshToken: string) {
    // ---------------------------------------------------------
    // STEP 1: Verify refresh token A
    // ---------------------------------------------------------

    // 1. Hash refresh token A received from the client
    const tokenHash = this.hashRefreshToken(refreshToken);

    // 2. Find token A in PostgreSQL
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
      },
    });

    // 3. Token doesn't exist
    if (!storedToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    // 4. Token A was already revoked
    if (storedToken.revokedAt) {
      throw new UnauthorizedException(
        "Refresh token has been revoked",
      );
    }

    // 5. Token A expired
    if (storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException(
        "Refresh token has expired",
      );
    }

    // 6. Find the owner of token A
    const user = await this.usersService.findById(
      storedToken.userId,
    );

    if (!user) {
      throw new UnauthorizedException(
        "User no longer exists",
      );
    }

    // 7. Check account status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        "User account is not active",
      );
    }

    // 8. Check account lock
    if (
      user.lockedUntil &&
      user.lockedUntil > new Date()
    ) {
      throw new UnauthorizedException(
        "User account is temporarily locked",
      );
    }

    // At this point:
    //
    // Refresh Token A exists       ✅
    // Refresh Token A not revoked  ✅
    // Refresh Token A not expired  ✅
    // User exists                  ✅
    // User active                  ✅
    // User not locked              ✅

    // ---------------------------------------------------------
    // STEP 2: Generate the new tokens
    // ---------------------------------------------------------

    // 9. Generate a new access token
    const accessToken =
      await this.generateAccessToken(user);

    // 10. Generate refresh token B
    const newRefreshToken =
      randomBytes(32).toString("hex");

    // 11. Hash refresh token B before storing it
    const newTokenHash =
      this.hashRefreshToken(newRefreshToken);

    // 12. Refresh token B expires in 7 days
    const newExpiresAt = new Date();
    newExpiresAt.setDate(
      newExpiresAt.getDate() + 7,
    );

    // ---------------------------------------------------------
    // STEP 3: Rotate refresh tokens
    // ---------------------------------------------------------

    // Revoke A and create B together.
    // If one operation fails, Prisma rolls back both.
    await this.prisma.$transaction([
      // 13A. Revoke refresh token A
      this.prisma.refreshToken.update({
        where: {
          id: storedToken.id,
        },
        data: {
          revokedAt: new Date(),
        },
      }),

      // 13B. Store HASH of refresh token B
      this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: newTokenHash,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

    // 14. Return NEW access token + NEW refresh token B
    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: "Bearer",
      expiresIn: 900,
    };
  }

  async logout(refreshToken: string): Promise<void> {
  // 1. Hash the refresh token received from the client
  const tokenHash = this.hashRefreshToken(refreshToken);

  // 2. Find the refresh token in PostgreSQL
  const storedToken = await this.prisma.refreshToken.findFirst({
    where: {
      tokenHash,
    },
  });

  // 3. Token doesn't exist
  if (!storedToken) {
    throw new UnauthorizedException("Invalid refresh token");
  }

  // 4. Token is already revoked
  if (storedToken.revokedAt) {
    throw new UnauthorizedException(
      "Refresh token has already been revoked",
    );
  }

  // 5. Revoke the refresh token
  await this.prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

  // =========================================================
  // HELPERS
  // =========================================================

  private hashRefreshToken(
    refreshToken: string,
  ): string {
    return createHash("sha256")
      .update(refreshToken)
      .digest("hex");
  }

  private async generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const jwtSecret =
      this.configService.get<string>("JWT_SECRET");

    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not configured",
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: "15m",
    });
  }
}