import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, UploadCategory, VerificationDocumentType } from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";

import { CreateDoctorProfileDto } from "./dto/create-doctor-profile.dto";
import { UpdateDoctorProfileDto } from "./dto/update-doctor-profile.dto";
import { SearchDoctorsDto } from "./dto/search-doctors.dto";
import { UploadsService } from "../uploads/uploads.service";

@Injectable()
export class DoctorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  private getDoctorUploadCategory(type: VerificationDocumentType): UploadCategory {
    switch (type) {
      case VerificationDocumentType.MEDICAL_LICENSE:
        return UploadCategory.DOCTOR_LICENSE;
      case VerificationDocumentType.DIPLOMA:
        return UploadCategory.DOCTOR_DIPLOMA;
      default:
        return UploadCategory.DOCTOR_DOCUMENT;
    }
  }

  async uploadVerificationDocument(userId: string, file: Express.Multer.File, type: VerificationDocumentType) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException("Doctor profile not found");

    const upload = await this.uploadsService.uploadFile(file, this.getDoctorUploadCategory(type), userId);
    return this.prisma.doctorVerificationDocument.create({
      data: { doctorId: doctor.id, type, fileUrl: upload.url },
    });
  }

  async getMyVerificationDocuments(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new NotFoundException("Doctor profile not found");
    return this.prisma.doctorVerificationDocument.findMany({
      where: { doctorId: doctor.id }, orderBy: { uploadedAt: "desc" },
    });
  }

  // =========================================================
  // CREATE MY DOCTOR PROFILE
  // =========================================================

  async createMyProfile(
    userId: string,
    dto: CreateDoctorProfileDto,
  ) {
    // 1. Check if this user already has a Doctor profile
    const existingDoctor =
      await this.prisma.doctor.findUnique({
        where: {
          userId,
        },
      });

    if (existingDoctor) {
      throw new ConflictException(
        "Doctor profile already exists",
      );
    }

    // 2. License number must also be unique
    const existingLicense =
      await this.prisma.doctor.findUnique({
        where: {
          licenseNumber: dto.licenseNumber,
        },
      });

    if (existingLicense) {
      throw new ConflictException(
        "License number is already in use",
      );
    }

    // 3. Create Doctor profile
    return this.prisma.doctor.create({
      data: {
        userId,
        licenseNumber: dto.licenseNumber,
        bio: dto.bio,
        yearsExperience: dto.yearsExperience,
        defaultConsultationPrice:
          dto.defaultConsultationPrice,
        acceptsOnlineBooking:
          dto.acceptsOnlineBooking,
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
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  // =========================================================
  // GET MY DOCTOR PROFILE
  // =========================================================

  async getMyProfile(userId: string) {
    const doctor =
      await this.prisma.doctor.findUnique({
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
          specialties: {
            include: {
              specialty: true,
            },
          },
        },
      });

    if (!doctor) {
      throw new NotFoundException(
        "Doctor profile not found",
      );
    }

    return doctor;
  }

  // =========================================================
  // UPDATE MY DOCTOR PROFILE
  // =========================================================

  async updateMyProfile(
    userId: string,
    dto: UpdateDoctorProfileDto,
  ) {
    const doctor =
      await this.prisma.doctor.findUnique({
        where: {
          userId,
        },
      });

    if (!doctor) {
      throw new NotFoundException(
        "Doctor profile not found",
      );
    }

    return this.prisma.doctor.update({
      where: {
        userId,
      },
      data: {
        ...(dto.bio !== undefined && {
          bio: dto.bio,
        }),

        ...(dto.yearsExperience !== undefined && {
          yearsExperience: dto.yearsExperience,
        }),

        ...(dto.defaultConsultationPrice !==
          undefined && {
          defaultConsultationPrice:
            dto.defaultConsultationPrice,
        }),

        ...(dto.acceptsOnlineBooking !==
          undefined && {
          acceptsOnlineBooking:
            dto.acceptsOnlineBooking,
        }),
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
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
  }

  // =========================================================
  // SEARCH / LIST DOCTORS
  // =========================================================

  async searchDoctors(query: SearchDoctorsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const where: Prisma.DoctorWhereInput = {};

    // Search by doctor name or license number
    if (query.search) {
      where.OR = [
        {
          licenseNumber: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          user: {
            firstName: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            lastName: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
        {
          specialties: {
            some: {
              specialty: {
                name: {
                  contains: query.search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ];
    }

    // Filter by specialty
    if (query.specialtyId) {
      where.specialties = {
        some: {
          specialtyId: query.specialtyId,
        },
      };
    }

    // Filter by years of experience
    if (query.minYearsExperience !== undefined) {
      where.yearsExperience = {
        gte: query.minYearsExperience,
      };
    }

    // Filter by consultation price
    if (
      query.minConsultationPrice !== undefined ||
      query.maxConsultationPrice !== undefined
    ) {
      where.defaultConsultationPrice = {
        ...(query.minConsultationPrice !==
          undefined && {
          gte: query.minConsultationPrice,
        }),

        ...(query.maxConsultationPrice !==
          undefined && {
          lte: query.maxConsultationPrice,
        }),
      };
    }

    // Filter by online booking
    if (query.acceptsOnlineBooking !== undefined) {
      where.acceptsOnlineBooking =
        query.acceptsOnlineBooking;
    }

    const [doctors, total] =
      await this.prisma.$transaction([
        this.prisma.doctor.findMany({
          where,
          skip,
          take: limit,

          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },

            specialties: {
              include: {
                specialty: true,
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },
        }),

        this.prisma.doctor.count({
          where,
        }),
      ]);

    return {
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // GET ONE DOCTOR
  // =========================================================

  async getDoctorById(doctorId: string) {
    const doctor =
      await this.prisma.doctor.findUnique({
        where: {
          id: doctorId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },

          specialties: {
            include: {
              specialty: true,
            },
          },
        },
      });

    if (!doctor) {
      throw new NotFoundException(
        "Doctor not found",
      );
    }

    return doctor;
  }
}
