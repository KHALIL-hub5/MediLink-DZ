import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  DispensingStatus,
  OrganizationStatus,
  PrescriptionStatus,
  Prisma,
  PharmacyStaffRole,
  PharmacyVerificationDocumentType,
  UploadCategory,
} from "@prisma/client";

import { PrismaService } from "../../database/prisma.service";

import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { DispensePrescriptionDto } from "./dto/dispense-prescription.dto";
import { UploadsService } from "../uploads/uploads.service";

@Injectable()
export class PharmaciesService {
  constructor(private readonly prisma: PrismaService, private readonly uploadsService: UploadsService) {}

  private getPharmacyUploadCategory(type: PharmacyVerificationDocumentType): UploadCategory {
    return type === PharmacyVerificationDocumentType.OPERATING_LICENSE || type === PharmacyVerificationDocumentType.PHARMACIST_LICENSE
      ? UploadCategory.PHARMACY_LICENSE
      : UploadCategory.PHARMACY_DOCUMENT;
  }

  async uploadVerificationDocument(userId: string, pharmacyId: string, file: Express.Multer.File, type: PharmacyVerificationDocumentType) {
    const pharmacy = await this.prisma.pharmacy.findFirst({ where: { id: pharmacyId, deletedAt: null } });
    if (!pharmacy) throw new NotFoundException("Pharmacy not found.");
    const membership = await this.prisma.pharmacyStaff.findFirst({
      where: { userId, pharmacyId, isActive: true, role: { in: [PharmacyStaffRole.OWNER, PharmacyStaffRole.MANAGER] } },
    });
    if (!membership) throw new ForbiddenException("You do not have permission to manage this pharmacy.");
    const upload = await this.uploadsService.uploadFile(file, this.getPharmacyUploadCategory(type), userId);
    return this.prisma.pharmacyVerificationDocument.create({ data: { pharmacyId, type, fileUrl: upload.url } });
  }

  async getVerificationDocuments(userId: string, pharmacyId: string) {
    const pharmacy = await this.prisma.pharmacy.findFirst({ where: { id: pharmacyId, deletedAt: null } });
    if (!pharmacy) throw new NotFoundException("Pharmacy not found.");
    const membership = await this.prisma.pharmacyStaff.findFirst({ where: { userId, pharmacyId, isActive: true } });
    if (!membership) throw new ForbiddenException("You do not have access to this pharmacy.");
    return this.prisma.pharmacyVerificationDocument.findMany({ where: { pharmacyId }, orderBy: { uploadedAt: "desc" } });
  }

  // =========================================================
  // HELPERS
  // =========================================================

  private async getPharmacyStaffByUserId(userId: string) {
    const memberships = await this.prisma.pharmacyStaff.findMany({
      where: {
        userId,
        isActive: true,
        pharmacy: {
          deletedAt: null,
        },
      },
      include: {
        pharmacy: true,
      },
      take: 2,
    });

    if (memberships.length === 0) {
      throw new ForbiddenException(
        "An active pharmacy staff profile is required.",
      );
    }

    if (memberships.length > 1) {
      throw new BadRequestException(
        "This user belongs to multiple active pharmacies.",
      );
    }

    return memberships[0];
  }

  private async verifyPrescriptionAccess(
    prescriptionId: string,
    pharmacyId: string,
  ) {
    const access = await this.prisma.prescriptionAccess.findFirst({
      where: {
        prescriptionId,
        pharmacyId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!access) {
      throw new ForbiddenException(
        "This pharmacy does not have access to this prescription.",
      );
    }

    return access;
  }

  private startOfTodayUtc() {
    const now = new Date();

    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }

  // =========================================================
  // PUBLIC PHARMACIES
  // =========================================================

  async findAll() {
    return this.prisma.pharmacy.findMany({
      where: {
        status: OrganizationStatus.APPROVED,
        deletedAt: null,
      },
      include: {
        commune: true,
        openingHours: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findOne(pharmacyId: string) {
    const pharmacy = await this.prisma.pharmacy.findFirst({
      where: {
        id: pharmacyId,
        status: OrganizationStatus.APPROVED,
        deletedAt: null,
      },
      include: {
        commune: true,
        openingHours: true,
      },
    });

    if (!pharmacy) {
      throw new NotFoundException("Pharmacy not found.");
    }

    return pharmacy;
  }

  // =========================================================
  // STAFF PHARMACY
  // =========================================================

  async getMyPharmacy(userId: string) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    return this.prisma.pharmacy.findUnique({
      where: {
        id: staff.pharmacyId,
      },
      include: {
        commune: true,
        openingHours: true,
      },
    });
  }

  // =========================================================
  // INVENTORY
  // =========================================================

  async getMyInventory(userId: string) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    return this.prisma.pharmacyInventory.findMany({
      where: {
        pharmacyId: staff.pharmacyId,
      },
      include: {
        medication: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async updateInventory(
    userId: string,
    medicationId: string,
    dto: UpdateInventoryDto,
  ) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    if (dto.stockQuantity === undefined && dto.unitPrice === undefined) {
      throw new BadRequestException(
        "At least one inventory field must be provided.",
      );
    }

    const medication = await this.prisma.medication.findFirst({
      where: {
        id: medicationId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!medication) {
      throw new NotFoundException("Medication not found.");
    }

    const unitPrice =
      dto.unitPrice !== undefined
        ? new Prisma.Decimal(dto.unitPrice)
        : undefined;

    return this.prisma.pharmacyInventory.upsert({
      where: {
        pharmacyId_medicationId: {
          pharmacyId: staff.pharmacyId,
          medicationId,
        },
      },

      create: {
        pharmacyId: staff.pharmacyId,
        medicationId,

        stockQuantity: dto.stockQuantity ?? 0,

        unitPrice,

        lastVerifiedAt: new Date(),
      },

      update: {
        ...(dto.stockQuantity !== undefined && {
          stockQuantity: dto.stockQuantity,
        }),

        ...(unitPrice !== undefined && {
          unitPrice,
        }),

        lastVerifiedAt: new Date(),
      },

      include: {
        medication: true,
      },
    });
  }

  // =========================================================
  // PRESCRIPTION ACCESS
  // =========================================================

  async getPrescription(userId: string, prescriptionId: string) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    await this.verifyPrescriptionAccess(prescriptionId, staff.pharmacyId);

    const prescription = await this.prisma.prescription.findUnique({
      where: {
        id: prescriptionId,
      },

      include: {
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
      },
    });

    if (!prescription) {
      throw new NotFoundException("Prescription not found.");
    }

    return prescription;
  }

  // =========================================================
  // DISPENSING
  // =========================================================

  async dispensePrescription(
    userId: string,
    prescriptionId: string,
    dto: DispensePrescriptionDto,
  ) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    if (staff.pharmacy.status !== OrganizationStatus.APPROVED) {
      throw new ForbiddenException(
        "Only an approved pharmacy can dispense prescriptions.",
      );
    }

    const uniqueItemIds = new Set(
      dto.items.map((item) => item.prescriptionItemId),
    );

    if (uniqueItemIds.size !== dto.items.length) {
      throw new BadRequestException(
        "A prescription item cannot appear more than once.",
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        // -----------------------------------------------
        // 1. Verify pharmacy access again inside transaction
        // -----------------------------------------------

        const access = await tx.prescriptionAccess.findFirst({
          where: {
            prescriptionId,
            pharmacyId: staff.pharmacyId,
            revokedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!access) {
          throw new ForbiddenException(
            "This pharmacy does not have access to this prescription.",
          );
        }

        // -----------------------------------------------
        // 2. Load prescription
        // -----------------------------------------------

        const prescription = await tx.prescription.findUnique({
          where: {
            id: prescriptionId,
          },

          include: {
            items: true,
          },
        });

        if (!prescription) {
          throw new NotFoundException("Prescription not found.");
        }

        // -----------------------------------------------
        // 3. Status validation
        // -----------------------------------------------

        if (prescription.status !== PrescriptionStatus.ACTIVE) {
          throw new BadRequestException(
            "Only active prescriptions can be dispensed.",
          );
        }

        // -----------------------------------------------
        // 4. Expiration validation
        // -----------------------------------------------

        if (
          prescription.validUntil &&
          prescription.validUntil < this.startOfTodayUtc()
        ) {
          throw new BadRequestException("This prescription has expired.");
        }

        // -----------------------------------------------
        // 5. Electronic dispensing requires
        // medicationId + quantity
        // -----------------------------------------------

        for (const item of prescription.items) {
          if (
            !item.medicationId ||
            item.quantity == null ||
            item.quantity < 1
          ) {
            throw new BadRequestException(
              `Prescription item ${item.id} cannot be electronically dispensed because medicationId or quantity is missing.`,
            );
          }
        }

        const prescriptionItemIds = prescription.items.map((item) => item.id);

        // -----------------------------------------------
        // 6. Calculate quantities already dispensed
        // -----------------------------------------------

        const previousDispensingItems =
          await tx.prescriptionDispensingItem.findMany({
            where: {
              prescriptionItemId: {
                in: prescriptionItemIds,
              },

              dispensing: {
                prescriptionId,
                status: DispensingStatus.DISPENSED,
              },
            },

            select: {
              prescriptionItemId: true,
              quantityDispensed: true,
            },
          });

        const previouslyDispensed = new Map<string, number>();

        for (const item of previousDispensingItems) {
          const current = previouslyDispensed.get(item.prescriptionItemId) ?? 0;

          previouslyDispensed.set(
            item.prescriptionItemId,
            current + item.quantityDispensed,
          );
        }

        const preparedItems: Array<{
          prescriptionItemId: string;
          inventoryId: string;
          quantityRequested: number;
          quantityDispensed: number;
          medicationName: string;
        }> = [];

        const currentDispensed = new Map<string, number>();

        // -----------------------------------------------
        // 7. Validate each item requested by pharmacy
        // -----------------------------------------------

        for (const dtoItem of dto.items) {
          const prescriptionItem = prescription.items.find(
            (item) => item.id === dtoItem.prescriptionItemId,
          );

          if (!prescriptionItem) {
            throw new BadRequestException(
              `Prescription item ${dtoItem.prescriptionItemId} does not belong to this prescription.`,
            );
          }

          const requiredQuantity = prescriptionItem.quantity;

          const medicationId = prescriptionItem.medicationId;

          if (requiredQuantity == null || !medicationId) {
            throw new BadRequestException(
              "Prescription item cannot be electronically dispensed.",
            );
          }

          const alreadyDispensed =
            previouslyDispensed.get(prescriptionItem.id) ?? 0;

          const remainingQuantity = requiredQuantity - alreadyDispensed;

          if (remainingQuantity <= 0) {
            throw new BadRequestException(
              `${prescriptionItem.medicationName} has already been completely dispensed.`,
            );
          }

          if (dtoItem.quantity > remainingQuantity) {
            throw new BadRequestException(
              `Cannot dispense ${dtoItem.quantity} units of ${prescriptionItem.medicationName}. Only ${remainingQuantity} remain.`,
            );
          }

          // ---------------------------------------------
          // Find pharmacy inventory
          // ---------------------------------------------

          const inventory = await tx.pharmacyInventory.findUnique({
            where: {
              pharmacyId_medicationId: {
                pharmacyId: staff.pharmacyId,
                medicationId,
              },
            },
          });

          if (!inventory) {
            throw new BadRequestException(
              `${prescriptionItem.medicationName} is not present in this pharmacy's inventory.`,
            );
          }

          const availableQuantity =
            inventory.stockQuantity - inventory.reservedQuantity;

          if (dtoItem.quantity > availableQuantity) {
            throw new BadRequestException(
              `Not enough stock for ${prescriptionItem.medicationName}. Available quantity: ${availableQuantity}.`,
            );
          }

          preparedItems.push({
            prescriptionItemId: prescriptionItem.id,

            inventoryId: inventory.id,

            quantityRequested: remainingQuantity,

            quantityDispensed: dtoItem.quantity,

            medicationName: prescriptionItem.medicationName,
          });

          currentDispensed.set(prescriptionItem.id, dtoItem.quantity);
        }

        // -----------------------------------------------
        // 8. Create dispensing
        // -----------------------------------------------

        const dispensing = await tx.prescriptionDispensing.create({
          data: {
            prescriptionId,
            pharmacyId: staff.pharmacyId,
            pharmacyStaffId: staff.id,

            status: DispensingStatus.DISPENSED,

            dispensedAt: new Date(),

            notes: dto.notes,

            items: {
              create: preparedItems.map((item) => ({
                prescriptionItemId: item.prescriptionItemId,

                inventoryId: item.inventoryId,

                quantityRequested: item.quantityRequested,

                quantityDispensed: item.quantityDispensed,

                dispensedMedicationName: item.medicationName,
              })),
            },
          },
        });

        // -----------------------------------------------
        // 9. Decrease pharmacy inventory
        // -----------------------------------------------

        for (const item of preparedItems) {
          await tx.pharmacyInventory.update({
            where: {
              id: item.inventoryId,
            },

            data: {
              stockQuantity: {
                decrement: item.quantityDispensed,
              },

              lastVerifiedAt: new Date(),
            },
          });
        }

        // -----------------------------------------------
        // 10. Determine whether prescription
        // is now completely fulfilled
        // -----------------------------------------------

        const allItemsDispensed = prescription.items.every(
          (prescriptionItem) => {
            const required = prescriptionItem.quantity ?? 0;

            const before = previouslyDispensed.get(prescriptionItem.id) ?? 0;

            const now = currentDispensed.get(prescriptionItem.id) ?? 0;

            return before + now >= required;
          },
        );

        let finalPrescriptionStatus: PrescriptionStatus =
          PrescriptionStatus.ACTIVE;

        // -----------------------------------------------
        // 11. Automatic prescription completion
        // -----------------------------------------------

        if (allItemsDispensed) {
          await tx.prescription.update({
            where: {
              id: prescriptionId,
            },

            data: {
              status: PrescriptionStatus.COMPLETED,
            },
          });

          finalPrescriptionStatus = PrescriptionStatus.COMPLETED;
        }

        // -----------------------------------------------
        // 12. Return result
        // -----------------------------------------------

        const result = await tx.prescriptionDispensing.findUnique({
          where: {
            id: dispensing.id,
          },

          include: {
            pharmacy: true,

            pharmacyStaff: {
              include: {
                user: true,
              },
            },

            items: {
              include: {
                prescriptionItem: true,

                inventory: {
                  include: {
                    medication: true,
                  },
                },
              },
            },
          },
        });

        return {
          dispensing: result,
          prescriptionStatus: finalPrescriptionStatus,
        };
      },

      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // =========================================================
  // DISPENSING HISTORY
  // =========================================================

  async getDispensings(userId: string) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    return this.prisma.prescriptionDispensing.findMany({
      where: {
        pharmacyId: staff.pharmacyId,
      },

      include: {
        prescription: {
          select: {
            id: true,
            status: true,
            issuedAt: true,
            validUntil: true,
          },
        },

        pharmacyStaff: {
          include: {
            user: true,
          },
        },

        items: {
          include: {
            prescriptionItem: true,

            inventory: {
              include: {
                medication: true,
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

  async getDispensing(userId: string, dispensingId: string) {
    const staff = await this.getPharmacyStaffByUserId(userId);

    const dispensing = await this.prisma.prescriptionDispensing.findFirst({
      where: {
        id: dispensingId,
        pharmacyId: staff.pharmacyId,
      },

      include: {
        prescription: true,

        pharmacyStaff: {
          include: {
            user: true,
          },
        },

        items: {
          include: {
            prescriptionItem: true,

            inventory: {
              include: {
                medication: true,
              },
            },
          },
        },
      },
    });

    if (!dispensing) {
      throw new NotFoundException("Dispensing record not found.");
    }

    return dispensing;
  }
}
