import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { UserRole } from "@prisma/client";

import { ClinicsService } from "./clinics.service";

import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { ClinicQueryDto } from "./dto/clinic-query.dto";
import { ReviewClinicDto } from "./dto/review-clinic.dto";

import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

type CurrentActor = {
  id: string;
  role: UserRole;
};

@Controller("clinics")
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  // --------------------
  // PUBLIC
  // --------------------

  @Get()
  @Public()
  findAll(@Query() query: ClinicQueryDto) {
    return this.clinicsService.findAll(query);
  }

  // Must be BEFORE ":id"
  @Get("mine")
  findMine(@CurrentUser() user: CurrentActor) {
    return this.clinicsService.findMine(user.id);
  }

  // Must also be BEFORE ":id"
  @Get("review-queue")
  @Roles(UserRole.PLATFORM_ADMIN)
  findReviewQueue() {
    return this.clinicsService.findReviewQueue();
  }

  @Get(":id")
  @Public()
  findOne(
    @Param("id", ParseUUIDPipe)
    id: string,
  ) {
    return this.clinicsService.findOnePublic(id);
  }

  // --------------------
  // CREATE
  // --------------------

  @Post()
  @Roles(UserRole.CLINIC_STAFF)
  create(@CurrentUser() user: CurrentActor, @Body() dto: CreateClinicDto) {
    return this.clinicsService.create(user.id, dto);
  }

  // --------------------
  // OWNER / MANAGER
  // --------------------

  @Patch(":id")
  update(
    @CurrentUser() user: CurrentActor,

    @Param("id", ParseUUIDPipe)
    id: string,

    @Body() dto: UpdateClinicDto,
  ) {
    return this.clinicsService.update(user, id, dto);
  }

  @Post(":id/submit")
  submit(
    @CurrentUser() user: CurrentActor,

    @Param("id", ParseUUIDPipe)
    id: string,
  ) {
    return this.clinicsService.submit(user, id);
  }

  // --------------------
  // ADMIN
  // --------------------

  @Patch(":id/review")
  @Roles(UserRole.PLATFORM_ADMIN)
  review(
    @CurrentUser() user: CurrentActor,

    @Param("id", ParseUUIDPipe)
    id: string,

    @Body() dto: ReviewClinicDto,
  ) {
    return this.clinicsService.review(user.id, id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.PLATFORM_ADMIN)
  remove(
    @Param("id", ParseUUIDPipe)
    id: string,
  ) {
    return this.clinicsService.remove(id);
  }
}
