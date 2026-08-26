import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";

import { SpecialtiesService } from "./specialties.service";

import { CreateSpecialtyDto } from "./dto/create-specialty.dto";

import { UpdateSpecialtyDto } from "./dto/update-specialty.dto";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("specialties")
export class SpecialtiesController {
  constructor(private readonly service: SpecialtiesService) {}

  @Post()
  @Roles("PLATFORM_ADMIN")
  create(@Body() dto: CreateSpecialtyDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles("PLATFORM_ADMIN")
  findAll() {
    return this.service.findAll();
  }

  @Get("search")
  search(@Query("q") q: string) {
    return this.service.search(q);
  }

  @Get(":id")
  @Roles("PLATFORM_ADMIN")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @Roles("PLATFORM_ADMIN")
  update(@Param("id") id: string, @Body() dto: UpdateSpecialtyDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @Roles("PLATFORM_ADMIN")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
