import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { AddPatientAllergyDto } from "./dto/add-patient-allergy.dto";
import { UpdatePatientAllergyDto } from "./dto/update-patient-allergy.dto";
import { AddPatientConditionDto } from "./dto/add-patient-condition.dto";
import { UpdatePatientConditionDto } from "./dto/update-patient-condition.dto";

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
          },
        },
        commune: true,
        allergies: {
          include: {
            allergy: true,
          },
        },
        conditions: {
          include: {
            condition: true,
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return patient;
  }

  async updateMyProfile(userId: string, dto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return this.prisma.patient.update({
      where: {
        userId,
      },
      data: {
        ...(dto.dateOfBirth !== undefined && {
          dateOfBirth: new Date(dto.dateOfBirth),
        }),

        ...(dto.gender !== undefined && {
          gender: dto.gender,
        }),

        ...(dto.bloodType !== undefined && {
          bloodType: dto.bloodType,
        }),

        ...(dto.addressLine !== undefined && {
          addressLine: dto.addressLine,
        }),

        ...(dto.communeId !== undefined && {
          communeId: dto.communeId,
        }),

        ...(dto.emergencyContactName !== undefined && {
          emergencyContactName: dto.emergencyContactName,
        }),

        ...(dto.emergencyContactPhone !== undefined && {
          emergencyContactPhone: dto.emergencyContactPhone,
        }),

        ...(dto.medicalNotes !== undefined && {
          medicalNotes: dto.medicalNotes,
        }),
      },
    });
  }

  async getMyAllergies(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return this.prisma.patientAllergy.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        allergy: true,
      },
    });
    console.log("helllllllow bebeeeeeeeeeeee");
  }

  async addMyAllergy(userId: string, dto: AddPatientAllergyDto) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    const allergy = await this.prisma.allergy.findUnique({
      where: {
        id: dto.allergyId,
      },
    });

    if (!allergy) {
      throw new NotFoundException("Allergy not found");
    }

    return this.prisma.patientAllergy.create({
      data: {
        patientId: patient.id,
        allergyId: dto.allergyId,
        severity: dto.severity,
        reaction: dto.reaction,
        notes: dto.notes,
      },
      include: {
        allergy: true,
      },
    });
  }

  async updateMyAllergy(
    userId: string,
    allergyId: string,
    dto: UpdatePatientAllergyDto,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return this.prisma.patientAllergy.update({
      where: {
        patientId_allergyId: {
          patientId: patient.id,
          allergyId,
        },
      },
      data: dto,
      include: {
        allergy: true,
      },
    });
  }

  async deleteMyAllergy(userId: string, allergyId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    await this.prisma.patientAllergy.delete({
      where: {
        patientId_allergyId: {
          patientId: patient.id,
          allergyId,
        },
      },
    });

    return {
      message: "Allergy removed successfully",
    };
  }

  async getMyConditions(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    return this.prisma.patientCondition.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        condition: true,
      },
    });
  }

  async addMyCondition(userId: string, dto: AddPatientConditionDto) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    const condition = await this.prisma.medicalCondition.findUnique({
      where: {
        id: dto.conditionId,
      },
    });

    if (!condition) {
      throw new NotFoundException("Medical condition not found");
    }

    return this.prisma.patientCondition.create({
      data: {
        patientId: patient.id,
        conditionId: dto.conditionId,
        status: dto.status,
        diagnosedAt: dto.diagnosedAt ? new Date(dto.diagnosedAt) : undefined,
        notes: dto.notes,
      },
      include: {
        condition: true,
      },
    });
  }

  async updateMyCondition(
    userId: string,
    conditionId: string,
    dto: UpdatePatientConditionDto,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    const patientCondition = await this.prisma.patientCondition.findUnique({
      where: {
        patientId_conditionId: {
          patientId: patient.id,
          conditionId,
        },
      },
    });

    if (!patientCondition) {
      throw new NotFoundException(
        "This medical condition is not associated with the patient",
      );
    }

    return this.prisma.patientCondition.update({
      where: {
        patientId_conditionId: {
          patientId: patient.id,
          conditionId,
        },
      },
      data: {
        ...(dto.status !== undefined && {
          status: dto.status,
        }),

        ...(dto.diagnosedAt !== undefined && {
          diagnosedAt: new Date(dto.diagnosedAt),
        }),

        ...(dto.notes !== undefined && {
          notes: dto.notes,
        }),
      },
      include: {
        condition: true,
      },
    });
  }

  async deleteMyCondition(userId: string, conditionId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        userId,
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient profile not found");
    }

    const patientCondition = await this.prisma.patientCondition.findUnique({
      where: {
        patientId_conditionId: {
          patientId: patient.id,
          conditionId,
        },
      },
    });

    if (!patientCondition) {
      throw new NotFoundException(
        "This medical condition is not associated with the patient",
      );
    }

    await this.prisma.patientCondition.delete({
      where: {
        patientId_conditionId: {
          patientId: patient.id,
          conditionId,
        },
      },
    });

    return {
      message: "Medical condition removed successfully",
    };
  }
}
