import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  ClinicStaffRole,
  OrganizationStatus,
  Prisma,
  UserRole,
} from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";

import { CreateClinicDto } from "./dto/create-clinic.dto";
import { UpdateClinicDto } from "./dto/update-clinic.dto";
import { ClinicQueryDto } from "./dto/clinic-query.dto";
import { ReviewClinicDto } from "./dto/review-clinic.dto";

type Actor = {
  id: string;
  role: UserRole;
};

@Injectable()
export class ClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------

  async create(userId: string, dto: CreateClinicDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new ForbiddenException(
        "Your account must be active before creating a clinic",
      );
    }

    if (user.role !== UserRole.CLINIC_STAFF) {
      throw new ForbiddenException(
        "Only clinic staff accounts can create clinics",
      );
    }

    const commune = await this.prisma.commune.findUnique({
      where: {
        id: dto.communeId,
      },
    });

    if (!commune) {
      throw new BadRequestException("Commune not found");
    }

    const slug = await this.generateUniqueSlug(dto.name);

    return this.prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: dto.name.trim(),
          slug,

          phone: dto.phone?.trim(),
          email: dto.email?.toLowerCase().trim(),

          addressLine: dto.addressLine.trim(),
          communeId: dto.communeId,

          latitude: dto.latitude,
          longitude: dto.longitude,

          status: OrganizationStatus.DRAFT,
        },
      });

      await tx.clinicStaff.create({
        data: {
          userId,
          clinicId: clinic.id,
          role: ClinicStaffRole.OWNER,
          isActive: true,
        },
      });

      return clinic;
    });
  }

  // --------------------------------------------------
  // PUBLIC LIST
  // --------------------------------------------------

  async findAll(query: ClinicQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ClinicWhereInput = {
      deletedAt: null,

      status: OrganizationStatus.APPROVED,

      ...(query.communeId !== undefined && {
        communeId: query.communeId,
      }),

      ...(query.q?.trim() && {
        OR: [
          {
            name: {
              contains: query.q.trim(),
              mode: "insensitive",
            },
          },
          {
            addressLine: {
              contains: query.q.trim(),
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinic.findMany({
        where,

        skip: (page - 1) * limit,
        take: limit,

        include: {
          commune: {
            include: {
              wilaya: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      }),

      this.prisma.clinic.count({
        where,
      }),
    ]);

    return {
      items,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // --------------------------------------------------
  // PUBLIC DETAILS
  // --------------------------------------------------

  async findOnePublic(id: string) {
    const clinic = await this.prisma.clinic.findFirst({
      where: {
        id,
        deletedAt: null,
        status: OrganizationStatus.APPROVED,
      },

      include: {
        commune: {
          include: {
            wilaya: true,
          },
        },

        doctors: {
          where: {
            acceptsOnlineBooking: true,

            doctor: {
              status: "APPROVED",
            },
          },

          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                  },
                },

                specialties: {
                  include: {
                    specialty: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!clinic) {
      throw new NotFoundException("Clinic not found");
    }

    return clinic;
  }

  // --------------------------------------------------
  // MY CLINICS
  // --------------------------------------------------

  async findMine(userId: string) {
    return this.prisma.clinicStaff.findMany({
      where: {
        userId,
        isActive: true,

        clinic: {
          deletedAt: null,
        },
      },

      include: {
        clinic: {
          include: {
            commune: {
              include: {
                wilaya: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------

  async update(actor: Actor, clinicId: string, dto: UpdateClinicDto) {
    const clinic = await this.getClinicOrThrow(clinicId);

    await this.assertCanManage(actor, clinicId);

    /*
     * We don't allow editing while the clinic
     * is currently being reviewed.
     */
    if (
      clinic.status === OrganizationStatus.SUBMITTED ||
      clinic.status === OrganizationStatus.UNDER_REVIEW
    ) {
      throw new BadRequestException(
        "Clinic cannot be edited while it is under review",
      );
    }

    /*
     * For the first version we also prevent direct
     * modification after approval.
     *
     * Later you can create a re-verification workflow.
     */
    if (clinic.status === OrganizationStatus.APPROVED) {
      throw new BadRequestException(
        "Approved clinic information cannot currently be modified without re-verification",
      );
    }

    if (dto.communeId !== undefined) {
      const commune = await this.prisma.commune.findUnique({
        where: {
          id: dto.communeId,
        },
      });

      if (!commune) {
        throw new BadRequestException("Commune not found");
      }
    }

    return this.prisma.clinic.update({
      where: {
        id: clinicId,
      },

      data: {
        ...(dto.name !== undefined && {
          name: dto.name.trim(),
        }),

        ...(dto.phone !== undefined && {
          phone: dto.phone.trim(),
        }),

        ...(dto.email !== undefined && {
          email: dto.email.toLowerCase().trim(),
        }),

        ...(dto.addressLine !== undefined && {
          addressLine: dto.addressLine.trim(),
        }),

        ...(dto.communeId !== undefined && {
          communeId: dto.communeId,
        }),

        ...(dto.latitude !== undefined && {
          latitude: dto.latitude,
        }),

        ...(dto.longitude !== undefined && {
          longitude: dto.longitude,
        }),
      },
    });
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async submit(actor: Actor, clinicId: string) {
    const clinic = await this.getClinicOrThrow(clinicId);

    await this.assertCanManage(actor, clinicId);

    if (
      clinic.status !== OrganizationStatus.DRAFT &&
      clinic.status !== OrganizationStatus.REJECTED
    ) {
      throw new BadRequestException(
        "Only draft or rejected clinics can be submitted",
      );
    }

    return this.prisma.clinic.update({
      where: {
        id: clinicId,
      },

      data: {
        status: OrganizationStatus.SUBMITTED,

        submittedAt: new Date(),

        reviewedAt: null,
        approvedAt: null,
        reviewedById: null,
        rejectionReason: null,
      },
    });
  }

  // --------------------------------------------------
  // ADMIN REVIEW QUEUE
  // --------------------------------------------------

  async findReviewQueue() {
    return this.prisma.clinic.findMany({
      where: {
        deletedAt: null,
        status: {
          in: [OrganizationStatus.SUBMITTED, OrganizationStatus.UNDER_REVIEW],
        },
      },

      include: {
        commune: {
          include: {
            wilaya: true,
          },
        },

        staff: {
          where: {
            role: ClinicStaffRole.OWNER,
            isActive: true,
          },

          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
      },

      orderBy: {
        submittedAt: "asc",
      },
    });
  }

  // --------------------------------------------------
  // ADMIN REVIEW
  // --------------------------------------------------

  async review(adminId: string, clinicId: string, dto: ReviewClinicDto) {
    const clinic = await this.getClinicOrThrow(clinicId);

    // STEP 1:
    // SUBMITTED -> UNDER_REVIEW
    if (dto.status === OrganizationStatus.UNDER_REVIEW) {
      if (clinic.status !== OrganizationStatus.SUBMITTED) {
        throw new BadRequestException(
          "Only submitted clinics can enter review",
        );
      }

      return this.prisma.clinic.update({
        where: {
          id: clinicId,
        },

        data: {
          status: OrganizationStatus.UNDER_REVIEW,

          reviewedById: adminId,

          rejectionReason: null,
        },
      });
    }

    // STEP 2:
    // UNDER_REVIEW -> APPROVED / REJECTED
    if (clinic.status !== OrganizationStatus.UNDER_REVIEW) {
      throw new BadRequestException(
        "Clinic must be under review before a final decision",
      );
    }

    if (
      dto.status !== OrganizationStatus.APPROVED &&
      dto.status !== OrganizationStatus.REJECTED
    ) {
      throw new BadRequestException("Decision must be APPROVED or REJECTED");
    }

    if (
      dto.status === OrganizationStatus.REJECTED &&
      !dto.rejectionReason?.trim()
    ) {
      throw new BadRequestException("Rejection reason is required");
    }

    const now = new Date();

    return this.prisma.clinic.update({
      where: {
        id: clinicId,
      },

      data: {
        status: dto.status,

        reviewedById: adminId,
        reviewedAt: now,

        approvedAt: dto.status === OrganizationStatus.APPROVED ? now : null,

        rejectionReason:
          dto.status === OrganizationStatus.REJECTED
            ? dto.rejectionReason!.trim()
            : null,
      },
    });
  }

  // --------------------------------------------------
  // ADMIN SOFT DELETE
  // --------------------------------------------------

  async remove(clinicId: string) {
    await this.getClinicOrThrow(clinicId);

    return this.prisma.clinic.update({
      where: {
        id: clinicId,
      },

      data: {
        deletedAt: new Date(),
        status: OrganizationStatus.CLOSED,
      },
    });
  }

  // --------------------------------------------------
  // INTERNAL HELPERS
  // --------------------------------------------------

  private async getClinicOrThrow(clinicId: string) {
    const clinic = await this.prisma.clinic.findFirst({
      where: {
        id: clinicId,
        deletedAt: null,
      },
    });

    if (!clinic) {
      throw new NotFoundException("Clinic not found");
    }

    return clinic;
  }

  private async assertCanManage(actor: Actor, clinicId: string) {
    if (actor.role === UserRole.PLATFORM_ADMIN) {
      return;
    }

    const membership = await this.prisma.clinicStaff.findFirst({
      where: {
        userId: actor.id,
        clinicId,
        isActive: true,

        role: {
          in: [ClinicStaffRole.OWNER, ClinicStaffRole.MANAGER],
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException(
        "You do not have permission to manage this clinic",
      );
    }
  }

  private async generateUniqueSlug(name: string) {
    const base =
      name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "clinic";

    let slug = base;
    let counter = 1;

    while (
      await this.prisma.clinic.findUnique({
        where: {
          slug,
        },
      })
    ) {
      slug = `${base}-${counter}`;
      counter++;
    }

    return slug;
  }
}
