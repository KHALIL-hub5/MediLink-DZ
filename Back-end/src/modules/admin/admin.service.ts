import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Prisma, VerificationDocumentStatus } from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";

import { ReviewDocumentDto } from "./dto/review-document.dto";

import { DocumentsQueryDto } from "./dto/documents-query.dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingDocuments() {
    const [doctors, clinics, pharmacies] = await Promise.all([
      this.prisma.doctorVerificationDocument.findMany({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },

        include: {
          doctor: {
            select: {
              id: true,
              licenseNumber: true,
              status: true,

              user: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },

        orderBy: {
          uploadedAt: "asc",
        },
      }),

      this.prisma.clinicVerificationDocument.findMany({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },

        include: {
          clinic: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },

        orderBy: {
          uploadedAt: "asc",
        },
      }),

      this.prisma.pharmacyVerificationDocument.findMany({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },

        include: {
          pharmacy: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },

        orderBy: {
          uploadedAt: "asc",
        },
      }),
    ]);

    return {
      doctors,
      clinics,
      pharmacies,

      total: doctors.length + clinics.length + pharmacies.length,
    };
  }

  async getDocumentStats() {
    const [
      doctorPending,
      clinicPending,
      pharmacyPending,

      doctorAccepted,
      clinicAccepted,
      pharmacyAccepted,

      doctorRejected,
      clinicRejected,
      pharmacyRejected,
    ] = await Promise.all([
      this.prisma.doctorVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },
      }),

      this.prisma.clinicVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },
      }),

      this.prisma.pharmacyVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.PENDING,
        },
      }),

      this.prisma.doctorVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.ACCEPTED,
        },
      }),

      this.prisma.clinicVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.ACCEPTED,
        },
      }),

      this.prisma.pharmacyVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.ACCEPTED,
        },
      }),

      this.prisma.doctorVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.REJECTED,
        },
      }),

      this.prisma.clinicVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.REJECTED,
        },
      }),

      this.prisma.pharmacyVerificationDocument.count({
        where: {
          status: VerificationDocumentStatus.REJECTED,
        },
      }),
    ]);

    return {
      pending: {
        doctors: doctorPending,
        clinics: clinicPending,
        pharmacies: pharmacyPending,

        total: doctorPending + clinicPending + pharmacyPending,
      },

      accepted: {
        doctors: doctorAccepted,
        clinics: clinicAccepted,
        pharmacies: pharmacyAccepted,

        total: doctorAccepted + clinicAccepted + pharmacyAccepted,
      },

      rejected: {
        doctors: doctorRejected,
        clinics: clinicRejected,
        pharmacies: pharmacyRejected,

        total: doctorRejected + clinicRejected + pharmacyRejected,
      },
    };
  }

  async getDoctorDocuments(doctorId: string, query: DocumentsQueryDto) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },

      select: {
        id: true,
        licenseNumber: true,
        status: true,

        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.DoctorVerificationDocumentWhereInput = {
      doctorId,

      ...(query.status && {
        status: query.status,
      }),
    };

    const [documents, total] = await this.prisma.$transaction([
      this.prisma.doctorVerificationDocument.findMany({
        where,

        skip: (page - 1) * limit,
        take: limit,

        orderBy: {
          uploadedAt: "desc",
        },
      }),

      this.prisma.doctorVerificationDocument.count({
        where,
      }),
    ]);

    return {
      doctor,
      documents,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getDoctorDocument(documentId: string) {
    const document = await this.prisma.doctorVerificationDocument.findUnique({
      where: {
        id: documentId,
      },

      include: {
        doctor: {
          select: {
            id: true,
            licenseNumber: true,

            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },

        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException("Doctor verification document not found");
    }

    return document;
  }
  async reviewDoctorDocument(
    adminId: string,
    documentId: string,
    dto: ReviewDocumentDto,
  ) {
    const document = await this.prisma.doctorVerificationDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException("Doctor verification document not found");
    }

    this.validateDocumentReview(dto);

    return this.prisma.doctorVerificationDocument.update({
      where: {
        id: documentId,
      },

      data: {
        status: dto.status,

        reviewNote: dto.reviewNote?.trim() ?? null,

        reviewedById: adminId,

        reviewedAt: new Date(),
      },
    });
  }

  async getClinicDocuments(clinicId: string, query: DocumentsQueryDto) {
    const clinic = await this.prisma.clinic.findFirst({
      where: {
        id: clinicId,
        deletedAt: null,
      },

      select: {
        id: true,
        name: true,
        status: true,
        submittedAt: true,
      },
    });

    if (!clinic) {
      throw new NotFoundException("Clinic not found");
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ClinicVerificationDocumentWhereInput = {
      clinicId,

      ...(query.status && {
        status: query.status,
      }),
    };

    const [documents, total] = await this.prisma.$transaction([
      this.prisma.clinicVerificationDocument.findMany({
        where,

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {
          uploadedAt: "desc",
        },
      }),

      this.prisma.clinicVerificationDocument.count({
        where,
      }),
    ]);

    return {
      clinic,
      documents,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getClinicDocument(documentId: string) {
    const document = await this.prisma.clinicVerificationDocument.findUnique({
      where: {
        id: documentId,
      },

      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },

        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException("Clinic verification document not found");
    }

    return document;
  }

  async reviewClinicDocument(
    adminId: string,
    documentId: string,
    dto: ReviewDocumentDto,
  ) {
    const document = await this.prisma.clinicVerificationDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException("Clinic verification document not found");
    }

    this.validateDocumentReview(dto);

    return this.prisma.clinicVerificationDocument.update({
      where: {
        id: documentId,
      },

      data: {
        status: dto.status,

        reviewNote: dto.reviewNote?.trim() ?? null,

        reviewedById: adminId,

        reviewedAt: new Date(),
      },
    });
  }

  async getPharmacyDocuments(pharmacyId: string, query: DocumentsQueryDto) {
    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: {
        id: pharmacyId,
        deletedAt: null,
      },

      select: {
        id: true,
        name: true,
        status: true,
        submittedAt: true,
      },
    });

    if (!pharmacy) {
      throw new NotFoundException("Pharmacy not found");
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.PharmacyVerificationDocumentWhereInput = {
      pharmacyId,

      ...(query.status && {
        status: query.status,
      }),
    };

    const [documents, total] = await this.prisma.$transaction([
      this.prisma.pharmacyVerificationDocument.findMany({
        where,

        skip: (page - 1) * limit,

        take: limit,

        orderBy: {
          uploadedAt: "desc",
        },
      }),

      this.prisma.pharmacyVerificationDocument.count({
        where,
      }),
    ]);

    return {
      pharmacy,
      documents,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPharmacyDocument(documentId: string) {
    const document = await this.prisma.pharmacyVerificationDocument.findUnique({
      where: {
        id: documentId,
      },

      include: {
        pharmacy: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },

        reviewedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException("Pharmacy verification document not found");
    }

    return document;
  }

  async reviewPharmacyDocument(
    adminId: string,
    documentId: string,
    dto: ReviewDocumentDto,
  ) {
    const document = await this.prisma.pharmacyVerificationDocument.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!document) {
      throw new NotFoundException("Pharmacy verification document not found");
    }

    this.validateDocumentReview(dto);

    return this.prisma.pharmacyVerificationDocument.update({
      where: {
        id: documentId,
      },

      data: {
        status: dto.status,

        reviewNote: dto.reviewNote?.trim() ?? null,

        reviewedById: adminId,

        reviewedAt: new Date(),
      },
    });
  }

  async getPatientDocuments(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id: patientId,
      },

      select: {
        id: true,

        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },

        documents: {
          orderBy: {
            uploadedAt: "desc",
          },
        },
      },
    });

    if (!patient) {
      throw new NotFoundException("Patient not found");
    }

    return patient;
  }

  async getPatientDocument(documentId: string) {
    const document = await this.prisma.patientDocument.findUnique({
      where: {
        id: documentId,
      },

      include: {
        patient: {
          select: {
            id: true,

            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException("Patient document not found");
    }

    return document;
  }

  private validateDocumentReview(dto: ReviewDocumentDto) {
    if (
      dto.status === VerificationDocumentStatus.REJECTED &&
      !dto.reviewNote?.trim()
    ) {
      throw new BadRequestException(
        "A review note is required when rejecting a document",
      );
    }
  }
}
