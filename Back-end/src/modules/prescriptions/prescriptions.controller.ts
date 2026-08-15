import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { PrescriptionsService } from "./prescriptions.service";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dto/update-prescription.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("prescriptions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  async create(
    @Request() req: any,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(req.user.id, createPrescriptionDto);
  }

  @Get("me")
  @Roles(UserRole.PATIENT)
  async findMyPrescriptions(@Request() req: any) {
    return this.prescriptionsService.findMyPrescriptions(req.user.id);
  }

  @Get("doctor/me")
  @Roles(UserRole.DOCTOR)
  async findDoctorPrescriptions(@Request() req: any) {
    return this.prescriptionsService.findDoctorPrescriptions(req.user.id);
  }

  @Get("medical-record/:medicalRecordId")
  @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.PLATFORM_ADMIN)
  async findByMedicalRecord(
    @Param("medicalRecordId", ParseUUIDPipe)
    medicalRecordId: string,
    @Request() req: any,
  ) {
    return this.prescriptionsService.findByMedicalRecord(
      medicalRecordId,
      req.user.id,
      req.user.role,
    );
  }

  @Get(":id")
  @Roles(UserRole.DOCTOR, UserRole.PATIENT, UserRole.PLATFORM_ADMIN)
  async findOne(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.prescriptionsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(":id")
  @Roles(UserRole.DOCTOR)
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(
      id,
      req.user.id,
      updatePrescriptionDto,
    );
  }

  @Patch(":id/cancel")
  @Roles(UserRole.DOCTOR)
  async cancel(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.prescriptionsService.cancel(id, req.user.id);
  }

  @Patch(":id/complete")
  @Roles(UserRole.DOCTOR)
  async complete(@Param("id", ParseUUIDPipe) id: string, @Request() req: any) {
    return this.prescriptionsService.complete(id, req.user.id);
  }
}
