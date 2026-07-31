import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) =>
        req?.headers?.authorization?.split(" ")[1] ?? null,
      secretOrKey: process.env.JWT_SECRET || "secret",
    });
  }

  validate(payload: any) {
    return payload;
  }
}
