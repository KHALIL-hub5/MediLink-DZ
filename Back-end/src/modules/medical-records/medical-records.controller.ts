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

import {
  UserRole,
} from "@prisma/client";

import {
  MedicalRecordsService,
} from "./medical-records.service";

import {
  CreateMedicalRecordDto,
} from "./dto/create-medical-record.dto";

import {
  UpdateMedicalRecordDto,
} from "./dto/update-medical-record.dto";

import {
  JwtAuthGuard,
} from "../auth/guards/jwt-auth.guard";

import {
  RolesGuard,
} from "../../common/guards/roles.guard";

import {
  Roles,
} from "../../common/decorators/roles.decorator";

@Controller("medical-records")
export class MedicalRecordsController {
  constructor(
    private readonly medicalRecordsService:
      MedicalRecordsService,
  ) {}

  // =========================================================
  // DOCTOR CREATES MEDICAL RECORD
  // =========================================================

  @Post("appointments/:appointmentId")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.DOCTOR,
  )
  async createFromAppointment(
    @Request() req: any,

    @Param(
      "appointmentId",
      ParseUUIDPipe,
    )
    appointmentId: string,

    @Body()
    dto: CreateMedicalRecordDto,
  ) {
    return this.medicalRecordsService
      .createFromAppointment(
        req.user.id,
        appointmentId,
        dto,
      );
  }

  // =========================================================
  // PATIENT GETS THEIR OWN MEDICAL HISTORY
  // =========================================================

  @Get("patient/me")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.PATIENT,
  )
  async getMyPatientRecords(
    @Request() req: any,
  ) {
    return this.medicalRecordsService
      .getMyPatientRecords(
        req.user.id,
      );
  }

  // =========================================================
  // DOCTOR GETS RECORDS CREATED BY THEM
  // =========================================================

  @Get("doctor/me")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.DOCTOR,
  )
  async getMyDoctorRecords(
    @Request() req: any,
  ) {
    return this.medicalRecordsService
      .getMyDoctorRecords(
        req.user.id,
      );
  }

  // =========================================================
  // GET ONE MEDICAL RECORD
  // =========================================================

  @Get(":id")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.DOCTOR,
    UserRole.PATIENT,
  )
  async findOne(
    @Request() req: any,

    @Param(
      "id",
      ParseUUIDPipe,
    )
    id: string,
  ) {
    return this.medicalRecordsService
      .findOne(
        req.user.id,
        req.user.role as UserRole,
        id,
      );
  }

  // =========================================================
  // DOCTOR UPDATES MEDICAL RECORD
  // =========================================================

  @Patch(":id")
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(
    UserRole.DOCTOR,
  )
  async update(
    @Request() req: any,

    @Param(
      "id",
      ParseUUIDPipe,
    )
    id: string,

    @Body()
    dto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService
      .update(
        req.user.id,
        id,
        dto,
      );
  }
}