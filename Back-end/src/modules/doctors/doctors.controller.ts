import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { DoctorsService } from "./doctors.service";

import { CreateDoctorProfileDto } from "./dto/create-doctor-profile.dto";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
import { SearchDoctorsDto } from "./dto/search-doctors.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("doctors")
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
  ) {}

  // =========================================================
  // SEARCH DOCTORS
  // =========================================================

  @Get()
  @UseGuards(JwtAuthGuard)
  async searchDoctors(
    @Query() query: SearchDoctorsDto,
  ) {
    return this.doctorsService.searchDoctors(query);
  }

  // =========================================================
  // CREATE MY PROFILE
  // =========================================================

  @Post("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async createMyProfile(
    @Request() req: any,
    @Body() dto: CreateDoctorProfileDto,
  ) {
    return this.doctorsService.createMyProfile(
      req.user.id,
      dto,
    );
  }

  // =========================================================
  // GET MY PROFILE
  // =========================================================

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async getMyProfile(
    @Request() req: any,
  ) {
    return this.doctorsService.getMyProfile(
      req.user.id,
    );
  }

  // =========================================================
  // UPDATE MY PROFILE
  // =========================================================

  @Patch("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updateMyProfile(
    @Request() req: any,
    @Body() dto: UpdateDoctorProfileDto,
  ) {
    return this.doctorsService.updateMyProfile(
      req.user.id,
      dto,
    );
  }

  // =========================================================
  // GET ONE DOCTOR
  // =========================================================

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getDoctorById(
    @Param("id", ParseUUIDPipe)
    doctorId: string,
  ) {
    return this.doctorsService.getDoctorById(
      doctorId,
    );
  }
}