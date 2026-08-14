import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentStatusDto } from "./dto/update-appointment-status.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.PATIENT)
  async create(@Request() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, dto);
  }

  @Get("me")
  async findMine(@Request() req: any) {
    return this.appointmentsService.findMine(req.user.id, req.user.role);
  }

  @Get(":id")
  async findOne(@Request() req: any, @Param("id", ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(req.user.id, id);
  }

  @Patch(":id/status")
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updateStatus(
    @Request() req: any,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.appointmentsService.updateStatus(req.user.id, id, dto);
  }

  @Patch(":id/reschedule")
  async reschedule(
    @Request() req: any,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: RescheduleAppointmentDto,
  ) {
    return this.appointmentsService.reschedule(req.user.id, id, dto);
  }

  @Patch(":id/cancel")
  async cancel(
    @Request() req: any,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(req.user.id, id, dto);
  }
}