import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { AvailabilityService } from "./availability.service";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("availability")
export class AvailabilityController {
  constructor(
    private readonly availabilityService:
      AvailabilityService,
  ) {}

  // Doctor sees their own schedule
  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async getMyAvailability(
    @Request() req: any,
  ) {
    return this.availabilityService.getMyAvailability(
      req.user.id,
    );
  }

  // Doctor creates a schedule
  @Post("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async createMyAvailability(
    @Request() req: any,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.createMyAvailability(
      req.user.id,
      dto,
    );
  }

  // Doctor modifies their schedule
  @Patch("me/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updateMyAvailability(
    @Request() req: any,
    @Param("id", ParseUUIDPipe)
    availabilityId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.updateMyAvailability(
      req.user.id,
      availabilityId,
      dto,
    );
  }

  // Doctor deletes their schedule
  @Delete("me/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async deleteMyAvailability(
    @Request() req: any,
    @Param("id", ParseUUIDPipe)
    availabilityId: string,
  ) {
    return this.availabilityService.deleteMyAvailability(
      req.user.id,
      availabilityId,
    );
  }

  // Patient/user views a doctor's active schedule
  @Get("doctor/:doctorId")
  @UseGuards(JwtAuthGuard)
  async getDoctorAvailability(
    @Param("doctorId", ParseUUIDPipe)
    doctorId: string,
  ) {
    return this.availabilityService.getDoctorAvailability(
      doctorId,
    );
  }
}