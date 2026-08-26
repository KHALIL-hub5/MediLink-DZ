import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LogoutDto } from "./dto/logout.dto";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserRole } from "@prisma/client";
import { Roles } from "./decorators/roles.decorator";
import { Public } from "./decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("forgot-password")
  @Public()
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post("reset-password")
  @Public()
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get("verify-email")
  @Public()
  verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    return {
      user: req.user,
    };
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: LogoutDto) {
    await this.authService.logout(dto.refreshToken);
    return {
      message: "Logout successful",
    };
  }
  @Get("admin-test")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async adminTest() {
    return {
      message: "You are allowed to access admin routes",
    };
  }
}
