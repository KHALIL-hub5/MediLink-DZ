import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { AppointmentStatus, UserRole } from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";

import { CreateMedicalRecordDto } from "./dto/create-medical-record.dto";
import { UpdateMedicalRecordDto } from "./dto/update-medical-record.dto";

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // PRIVATE HELPERS
  // =========================================================

  private async getDoctorByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }

    return doctor;
  }

  private async getPatientByUserId(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return patient;
  }

  // =========================================================
  // CREATE MEDICAL RECORD
  // =========================================================

  async createFromAppointment(
    userId: string,
    appointmentId: string,
    dto: CreateMedicalRecordDto,
  ) {
    // 1. Get authenticated doctor
    const doctor = await this.getDoctorByUserId(userId);

    // 2. Find appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        medicalRecord: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    // 3. Security:
    // logged-in doctor must own this appointment
    if (appointment.doctorId !== doctor.id) {
      throw new ForbiddenException(
        "You are not allowed to create a medical record for this appointment",
      );
    }

    // 4. Prevent creating record for invalid appointments
    if (
      appointment.status === AppointmentStatus.PENDING ||
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.NO_SHOW
    ) {
      throw new BadRequestException(
        `A medical record cannot be created for an appointment with status ${appointment.status}`,
      );
    }

    // CONFIRMED and COMPLETED are accepted.

    // 5. One appointment = one medical record
    if (appointment.medicalRecord) {
      throw new BadRequestException(
        "A medical record already exists for this appointment",
      );
    }

    // 6. Create medical record
    //
    // We only need appointmentId.
    // Doctor and patient info comes from the appointment.
    //
    return this.prisma.medicalRecord.create({
      data: {
        appointmentId: appointment.id,

        title: dto.title,

        symptoms: dto.symptoms,

        diagnosis: dto.diagnosis,

        notes: dto.notes,
      },

      include: {
        appointment: true,

        prescriptions: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  // =========================================================
  // GET PATIENT'S OWN MEDICAL RECORDS
  // =========================================================

  async getMyPatientRecords(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    return this.prisma.medicalRecord.findMany({
      where: {
        appointment: {
          patientId: patient.id,
        },
      },

      orderBy: {
        recordedAt: "desc",
      },

      include: {
        appointment: true,

        prescriptions: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  // =========================================================
  // GET DOCTOR'S CREATED MEDICAL RECORDS
  // =========================================================

  async getMyDoctorRecords(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);

    return this.prisma.medicalRecord.findMany({
      where: {
        appointment: {
          doctorId: doctor.id,
        },
      },

      orderBy: {
        recordedAt: "desc",
      },

      include: {
        appointment: true,

        prescriptions: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  // =========================================================
  // GET ONE MEDICAL RECORD
  // =========================================================

  async findOne(userId: string, role: UserRole, id: string) {
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: {
        id,
      },

      include: {
        appointment: true,

        prescriptions: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException("Medical record not found");
    }

    // --------------------------
    // Doctor access
    // --------------------------

    if (role === UserRole.DOCTOR) {
      const doctor = await this.getDoctorByUserId(userId);

      if (medicalRecord.appointment.doctorId !== doctor.id) {
        throw new ForbiddenException(
          "You are not allowed to access this medical record",
        );
      }

      return medicalRecord;
    }

    // --------------------------
    // Patient access
    // --------------------------

    if (role === UserRole.PATIENT) {
      const patient = await this.getPatientByUserId(userId);

      if (medicalRecord.appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          "You are not allowed to access this medical record",
        );
      }

      return medicalRecord;
    }

    throw new ForbiddenException(
      "You are not allowed to access this medical record",
    );
  }

  // =========================================================
  // UPDATE MEDICAL RECORD
  // =========================================================

  async update(userId: string, id: string, dto: UpdateMedicalRecordDto) {
    const doctor = await this.getDoctorByUserId(userId);

    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: {
        id,
      },
      include: {
        appointment: true,
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException("Medical record not found");
    }

    // Only doctor who created record can edit it
    if (medicalRecord.appointment.doctorId !== doctor.id) {
      throw new ForbiddenException(
        "You are not allowed to update this medical record",
      );
    }

    return this.prisma.medicalRecord.update({
      where: {
        id,
      },

      data: {
        title: dto.title,

        symptoms: dto.symptoms,

        diagnosis: dto.diagnosis,

        notes: dto.notes,
      },

      include: {
        appointment: true,

        prescriptions: {
          include: {
            items: true,
          },
        },
      },
    });
  }
}
