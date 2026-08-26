import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { AppointmentStatus } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentStatusDto } from "./dto/update-appointment-status.dto";
import { RescheduleAppointmentDto } from "./dto/reschedule-appointment.dto";
import { CancelAppointmentDto } from "./dto/cancel-appointment.dto";

const ALLOWED_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "REJECTED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    // resolve the Patient record for this authenticated user
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
    });
    if (!patient) {
      throw new NotFoundException("Patient profile not found for this user");
    }

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });
    if (!doctor) throw new NotFoundException("Doctor not found");
    if (!doctor.acceptsOnlineBooking) {
      throw new BadRequestException(
        "This doctor does not accept online booking",
      );
    }

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: dto.doctorId,
        scheduledAt: new Date(dto.scheduledAt),
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (conflict)
      throw new ConflictException("This time slot is already booked");

    return this.prisma.appointment.create({
      data: {
        patientId: patient.id, // ← Patient.id, not User.id
        doctorId: dto.doctorId,
        clinicId: dto.clinicId,
        createdById: userId, // this one IS User.id — createdById → User relation, that's correct
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes ?? 30,
        type: dto.type,
        reason: dto.reason,
        patientNotes: dto.patientNotes,
      },
      include: { doctor: true, clinic: true },
    });
  }

  async findMine(userId: string, role: "PATIENT" | "DOCTOR") {
    let where;
    if (role === "DOCTOR") {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
      if (!doctor)
        throw new NotFoundException("Doctor profile not found for this user");
      where = { doctorId: doctor.id };
    } else {
      const patient = await this.prisma.patient.findUnique({
        where: { userId },
      });
      if (!patient)
        throw new NotFoundException("Patient profile not found for this user");
      where = { patientId: patient.id };
    }

    return this.prisma.appointment.findMany({
      where,
      include: { doctor: true, clinic: true, patient: true },
      orderBy: { scheduledAt: "desc" },
    });
  }

  async findOne(userId: string, id: string) {
    const appt = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true, clinic: true, patient: true },
    });
    if (!appt) throw new NotFoundException("Appointment not found");

    // resolve this user's Patient and Doctor records, if they have one of each
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { userId } }),
      this.prisma.doctor.findUnique({ where: { userId } }),
    ]);

    const isPatientOwner = patient && appt.patientId === patient.id;
    const isDoctorOwner = doctor && appt.doctorId === doctor.id;

    if (!isPatientOwner && !isDoctorOwner) {
      throw new ForbiddenException("Not your appointment");
    }
    return appt;
  }

  async updateStatus(
    userId: string,
    id: string,
    dto: UpdateAppointmentStatusDto,
  ) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException("Appointment not found");

    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor || appt.doctorId !== doctor.id) {
      throw new ForbiddenException("Not your appointment");
    }

    const allowed = ALLOWED_TRANSITIONS[appt.status as AppointmentStatus];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot move from ${appt.status} to ${dto.status}`,
      );
    }
    if (dto.status === "REJECTED" && !dto.rejectionReason) {
      throw new BadRequestException(
        "rejectionReason is required when rejecting",
      );
    }

    const timestampField =
      dto.status === "CONFIRMED"
        ? "confirmedAt"
        : dto.status === "REJECTED"
          ? "rejectedAt"
          : dto.status === "COMPLETED"
            ? "completedAt"
            : dto.status === "CANCELLED"
              ? "cancelledAt"
              : null;

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
        doctorNotes: dto.doctorNotes,
        ...(timestampField ? { [timestampField]: new Date() } : {}),
      },
    });
  }

  async reschedule(userId: string, id: string, dto: RescheduleAppointmentDto) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException("Appointment not found");
    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { userId } }),
      this.prisma.doctor.findUnique({ where: { userId } }),
    ]);
    const isPatientOwner = patient && appt.patientId === patient.id;
    const isDoctorOwner = doctor && appt.doctorId === doctor.id;
    if (!isPatientOwner && !isDoctorOwner) {
      throw new ForbiddenException("Not your appointment");
    }
    if (!["PENDING", "CONFIRMED"].includes(appt.status)) {
      throw new BadRequestException(
        `Cannot reschedule a ${appt.status} appointment`,
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        scheduledAt: new Date(dto.scheduledAt),
        durationMinutes: dto.durationMinutes ?? appt.durationMinutes,
        status: "PENDING", // reschedule resets to pending re-confirmation — confirm this is the behavior you want
      },
    });
  }

  async cancel(userId: string, id: string, dto: CancelAppointmentDto) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException("Appointment not found");

    const [patient, doctor] = await Promise.all([
      this.prisma.patient.findUnique({ where: { userId } }),
      this.prisma.doctor.findUnique({ where: { userId } }),
    ]);
    const isPatientOwner = patient && appt.patientId === patient.id;
    const isDoctorOwner = doctor && appt.doctorId === doctor.id;
    if (!isPatientOwner && !isDoctorOwner) {
      throw new ForbiddenException("Not your appointment");
    }

    if (!["PENDING", "CONFIRMED"].includes(appt.status)) {
      throw new BadRequestException(
        `Cannot cancel a ${appt.status} appointment`,
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancellationReason: dto.cancellationReason,
        cancelledAt: new Date(),
      },
    });
  }
}
