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

@Controller("specialties")
export class SpecialtiesController {
  constructor(private readonly service: SpecialtiesService) {}

  @Post()
  create(@Body() dto: CreateSpecialtyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSpecialtyDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Get("search")
  search(@Query("q") q: string) {
    return this.service.search(q);
  }
}
