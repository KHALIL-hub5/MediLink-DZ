import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrescriptionStatus, Prisma, UserRole } from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";
import { CreatePrescriptionDto } from "./dto/create-prescription.dto";
import { UpdatePrescriptionDto } from "./dto/update-prescription.dto";

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  private getPrescriptionInclude() {
    return {
      items: {
        include: {
          medication: true,
        },
      },
      medicalRecord: {
        include: {
          appointment: true,
        },
      },
    };
  }

  private async getDoctorByUserId(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new ForbiddenException(
        "A doctor profile is required to perform this operation.",
      );
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
      throw new ForbiddenException(
        "A patient profile is required to perform this operation.",
      );
    }

    return patient;
  }

  private parseValidUntil(validUntil?: string) {
    if (!validUntil) {
      return undefined;
    }

    const parsedDate = new Date(validUntil);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        "The prescription validity date is invalid.",
      );
    }

    if (parsedDate <= new Date()) {
      throw new BadRequestException(
        "The prescription validity date must be in the future.",
      );
    }

    return parsedDate;
  }

  private async validateMedicationIds(
    medicationIds: Array<string | undefined>,
  ) {
    const uniqueMedicationIds = [
      ...new Set(
        medicationIds.filter((medicationId): medicationId is string =>
          Boolean(medicationId),
        ),
      ),
    ];

    if (uniqueMedicationIds.length === 0) {
      return;
    }

    const medications = await this.prisma.medication.findMany({
      where: {
        id: {
          in: uniqueMedicationIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (medications.length !== uniqueMedicationIds.length) {
      throw new BadRequestException(
        "One or more selected medications do not exist.",
      );
    }
  }

  async create(userId: string, createPrescriptionDto: CreatePrescriptionDto) {
    const doctor = await this.getDoctorByUserId(userId);
     console.log("hellllllllllo maaaaaaaaaaaaan");
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: {
        id: createPrescriptionDto.medicalRecordId,
      },
      select: {
        id: true,
        appointment: {
          select: {
            doctorId: true,
            patientId: true,
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException("Medical record not found.");
    }

    if (medicalRecord.appointment.doctorId !== doctor.id) {
      throw new ForbiddenException(
        "You cannot create a prescription for this medical record.",
      );
    }

    await this.validateMedicationIds(
      createPrescriptionDto.items.map((item) => item.medicationId),
    );

    const validUntil = this.parseValidUntil(createPrescriptionDto.validUntil);

    return this.prisma.prescription.create({
      data: {
        medicalRecordId: medicalRecord.id,
        validUntil,
        instructions: createPrescriptionDto.instructions,

        items: {
          create: createPrescriptionDto.items.map((item) => ({
            medicationId: item.medicationId,
            medicationName: item.medicationName,
            brandName: item.brandName,
            strength: item.strength,
            form: item.form,
            dosage: item.dosage,
            frequency: item.frequency,
            quantity: item.quantity,
            durationDays: item.durationDays,
            route: item.route,
            instructions: item.instructions,
          })),
        },
      },

      include: this.getPrescriptionInclude(),
    });
  }

  async findMyPrescriptions(userId: string) {
    const patient = await this.getPatientByUserId(userId);

    return this.prisma.prescription.findMany({
      where: {
        medicalRecord: {
          appointment: {
            patientId: patient.id,
          },
        },
      },
      include: this.getPrescriptionInclude(),
      orderBy: {
        issuedAt: "desc",
      },
    });
  }

  async findDoctorPrescriptions(userId: string) {
    const doctor = await this.getDoctorByUserId(userId);

    return this.prisma.prescription.findMany({
      where: {
        medicalRecord: {
          appointment: {
            doctorId: doctor.id,
          },
        },
      },
      include: this.getPrescriptionInclude(),
      orderBy: {
        issuedAt: "desc",
      },
    });
  }

  async findByMedicalRecord(
    medicalRecordId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const medicalRecord = await this.prisma.medicalRecord.findUnique({
      where: {
        id: medicalRecordId,
      },
      select: {
        id: true,
        appointment: {
          select: {
            doctorId: true,
            patientId: true,
          },
        },
      },
    });

    if (!medicalRecord) {
      throw new NotFoundException("Medical record not found.");
    }

    if (userRole === UserRole.DOCTOR) {
      const doctor = await this.getDoctorByUserId(userId);

      if (medicalRecord.appointment.doctorId !== doctor.id) {
        throw new ForbiddenException(
          "You cannot view prescriptions for this medical record.",
        );
      }
    } else if (userRole === UserRole.PATIENT) {
      const patient = await this.getPatientByUserId(userId);

      if (medicalRecord.appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          "You cannot view prescriptions for this medical record.",
        );
      }
    } else if (userRole !== UserRole.PLATFORM_ADMIN) {
      throw new ForbiddenException("You cannot access these prescriptions.");
    }

    return this.prisma.prescription.findMany({
      where: {
        medicalRecordId,
      },
      include: this.getPrescriptionInclude(),
      orderBy: {
        issuedAt: "desc",
      },
    });
  }

  async findOne(prescriptionId: string, userId: string, userRole: UserRole) {
    let where: Prisma.PrescriptionWhereInput = {
      id: prescriptionId,
    };

    if (userRole === UserRole.DOCTOR) {
      const doctor = await this.getDoctorByUserId(userId);

      where = {
        id: prescriptionId,
        medicalRecord: {
          appointment: {
            doctorId: doctor.id,
          },
        },
      };
    } else if (userRole === UserRole.PATIENT) {
      const patient = await this.getPatientByUserId(userId);

      where = {
        id: prescriptionId,
        medicalRecord: {
          appointment: {
            patientId: patient.id,
          },
        },
      };
    } else if (userRole !== UserRole.PLATFORM_ADMIN) {
      throw new ForbiddenException("You cannot access this prescription.");
    }

    const prescription = await this.prisma.prescription.findFirst({
      where,
      include: this.getPrescriptionInclude(),
    });

    if (!prescription) {
      throw new NotFoundException("Prescription not found or access denied.");
    }

    return prescription;
  }

  async update(
    prescriptionId: string,
    userId: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    const doctor = await this.getDoctorByUserId(userId);

    const prescription = await this.prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        medicalRecord: {
          appointment: {
            doctorId: doctor.id,
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException("Prescription not found or access denied.");
    }

    if (prescription.status !== PrescriptionStatus.ACTIVE) {
      throw new BadRequestException(
        "Only active prescriptions can be updated.",
      );
    }

    const validUntil =
      updatePrescriptionDto.validUntil !== undefined
        ? this.parseValidUntil(updatePrescriptionDto.validUntil)
        : undefined;

    return this.prisma.prescription.update({
      where: {
        id: prescriptionId,
      },
      data: {
        ...(validUntil !== undefined && {
          validUntil,
        }),
        ...(updatePrescriptionDto.instructions !== undefined && {
          instructions: updatePrescriptionDto.instructions,
        }),
      },
      include: this.getPrescriptionInclude(),
    });
  }

  async cancel(prescriptionId: string, userId: string) {
    const prescription = await this.findOwnedPrescription(
      prescriptionId,
      userId,
    );

    if (prescription.status === PrescriptionStatus.CANCELLED) {
      throw new BadRequestException("This prescription is already cancelled.");
    }

    if (prescription.status === PrescriptionStatus.COMPLETED) {
      throw new BadRequestException(
        "A completed prescription cannot be cancelled.",
      );
    }

    if (prescription.status === PrescriptionStatus.EXPIRED) {
      throw new BadRequestException(
        "An expired prescription cannot be cancelled.",
      );
    }

    return this.prisma.prescription.update({
      where: {
        id: prescriptionId,
      },
      data: {
        status: PrescriptionStatus.CANCELLED,
      },
      include: this.getPrescriptionInclude(),
    });
  }

  async complete(prescriptionId: string, userId: string) {
    const prescription = await this.findOwnedPrescription(
      prescriptionId,
      userId,
    );

    if (prescription.status !== PrescriptionStatus.ACTIVE) {
      throw new BadRequestException(
        "Only active prescriptions can be completed.",
      );
    }

    return this.prisma.prescription.update({
      where: {
        id: prescriptionId,
      },
      data: {
        status: PrescriptionStatus.COMPLETED,
      },
      include: this.getPrescriptionInclude(),
    });
  }

  private async findOwnedPrescription(prescriptionId: string, userId: string) {
    const doctor = await this.getDoctorByUserId(userId);

    const prescription = await this.prisma.prescription.findFirst({
      where: {
        id: prescriptionId,
        medicalRecord: {
          appointment: {
            doctorId: doctor.id,
          },
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!prescription) {
      throw new NotFoundException("Prescription not found or access denied.");
    }

    return prescription;
  }
}
