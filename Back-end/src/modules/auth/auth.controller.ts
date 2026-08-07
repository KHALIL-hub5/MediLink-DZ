import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: any) {
    return req.user;
  }
}

/* GET /auth/me
      ↓
@UseGuards(JwtAuthGuard)
      ↓
JwtAuthGuard
      ↓
AuthGuard('jwt')
      ↓
"Use strategy named jwt"
      ↓
JwtStrategy
      ↓
Extract Bearer token
      ↓
Verify signature
      ↓
Check expiration
      ↓
validate(payload)
      ↓
Did everything succeed? 

If yes:

Guard allows request ✅
      ↓
me() executes
      ↓
return req.user

*/