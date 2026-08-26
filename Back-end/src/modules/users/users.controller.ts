import { Controller, Get, Patch, Body } from "@nestjs/common";

import { UsersService } from "./users.service";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private service: UsersService) {}

  @Get("me")
  findMe(@CurrentUser() user: any) {
    return this.service.findMe(user.id);
  }

  @Patch("me")
  update(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.service.update(user.id, dto);
  }
}
