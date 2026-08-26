import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";
import { CreateAvailabilityDto } from "./dto/create-availability.dto";
import { UpdateAvailabilityDto } from "./dto/update-availability.dto";

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // GET MY AVAILABILITY
  // =========================================================

  async getMyAvailability(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }

    return this.prisma.doctorAvailability.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        clinic: true,
      },
      orderBy: [
        {
          dayOfWeek: "asc",
        },
        {
          startMinute: "asc",
        },
      ],
    });
  }

  // =========================================================
  // CREATE MY AVAILABILITY
  // =========================================================

  async createMyAvailability(userId: string, dto: CreateAvailabilityDto) {
    // 1. Find authenticated doctor's profile
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }

    // 2. Validate time
    if (dto.startMinute >= dto.endMinute) {
      throw new BadRequestException("Start time must be before end time");
    }

    // 3. Check clinic exists
    const clinic = await this.prisma.clinic.findUnique({
      where: {
        id: dto.clinicId,
      },
    });

    if (!clinic) {
      throw new NotFoundException("Clinic not found");
    }

    // 4. Check that the doctor works at this clinic
    const doctorClinic = await this.prisma.doctorClinic.findUnique({
      where: {
        doctorId_clinicId: {
          doctorId: doctor.id,
          clinicId: dto.clinicId,
        },
      },
    });

    if (!doctorClinic) {
      throw new BadRequestException(
        "Doctor is not associated with this clinic",
      );
    }

    // 5. Check if the exact availability already exists
    const existingAvailability = await this.prisma.doctorAvailability.findFirst(
      {
        where: {
          doctorId: doctor.id,
          clinicId: dto.clinicId,
          dayOfWeek: dto.dayOfWeek,
          startMinute: dto.startMinute,
        },
      },
    );

    if (existingAvailability) {
      throw new ConflictException(
        "Availability already exists for this doctor, clinic, day and start time",
      );
    }

    // 6. Create availability
    return this.prisma.doctorAvailability.create({
      data: {
        doctorId: doctor.id,
        clinicId: dto.clinicId,
        dayOfWeek: dto.dayOfWeek,
        startMinute: dto.startMinute,
        endMinute: dto.endMinute,

        ...(dto.slotDurationMinutes !== undefined && {
          slotDurationMinutes: dto.slotDurationMinutes,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },

      include: {
        clinic: true,
      },
    });
  }

  // =========================================================
  // UPDATE MY AVAILABILITY
  // =========================================================

  async updateMyAvailability(
    userId: string,
    availabilityId: string,
    dto: UpdateAvailabilityDto,
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }

    const availability = await this.prisma.doctorAvailability.findFirst({
      where: {
        id: availabilityId,
        doctorId: doctor.id,
      },
    });

    if (!availability) {
      throw new NotFoundException("Availability not found");
    }

    const newStartMinute = dto.startMinute ?? availability.startMinute;

    const newEndMinute = dto.endMinute ?? availability.endMinute;

    if (newStartMinute >= newEndMinute) {
      throw new BadRequestException("Start time must be before end time");
    }

    return this.prisma.doctorAvailability.update({
      where: {
        id: availability.id,
      },
      data: {
        ...(dto.clinicId !== undefined && {
          clinicId: dto.clinicId,
        }),

        ...(dto.dayOfWeek !== undefined && {
          dayOfWeek: dto.dayOfWeek,
        }),

        ...(dto.startMinute !== undefined && {
          startMinute: dto.startMinute,
        }),

        ...(dto.endMinute !== undefined && {
          endMinute: dto.endMinute,
        }),

        ...(dto.slotDurationMinutes !== undefined && {
          slotDurationMinutes: dto.slotDurationMinutes,
        }),

        ...(dto.isActive !== undefined && {
          isActive: dto.isActive,
        }),
      },
      include: {
        clinic: true,
      },
    });
  }

  // =========================================================
  // DELETE MY AVAILABILITY
  // =========================================================

  async deleteMyAvailability(userId: string, availabilityId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        userId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor profile not found");
    }

    const availability = await this.prisma.doctorAvailability.findFirst({
      where: {
        id: availabilityId,
        doctorId: doctor.id,
      },
    });

    if (!availability) {
      throw new NotFoundException("Availability not found");
    }

    await this.prisma.doctorAvailability.delete({
      where: {
        id: availability.id,
      },
    });

    return {
      message: "Availability deleted successfully",
    };
  }

  // =========================================================
  // GET ONE DOCTOR'S PUBLIC AVAILABILITY
  // =========================================================

  async getDoctorAvailability(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    });

    if (!doctor) {
      throw new NotFoundException("Doctor not found");
    }

    return this.prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        isActive: true,
      },
      include: {
        clinic: true,
      },
      orderBy: [
        {
          dayOfWeek: "asc",
        },
        {
          startMinute: "asc",
        },
      ],
    });
  }
}
