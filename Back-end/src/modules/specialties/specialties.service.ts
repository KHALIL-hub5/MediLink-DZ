import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

import { CreateSpecialtyDto } from "./dto/create-specialty.dto";
import { UpdateSpecialtyDto } from "./dto/update-specialty.dto";

@Injectable()
export class SpecialtiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    const existing = await this.prisma.specialty.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (existing) {
      throw new ConflictException("Specialty already exists");
    }

    return this.prisma.specialty.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.specialty.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({
      where: {
        id,
      },

      include: {
        doctors: true,
      },
    });

    if (!specialty) {
      throw new NotFoundException("Specialty not found");
    }

    return specialty;
  }

  async update(id: string, dto: UpdateSpecialtyDto) {
    await this.findOne(id);

    return this.prisma.specialty.update({
      where: {
        id,
      },

      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.specialty.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });
  }

  async search(query: string) {
    return this.prisma.specialty.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
  }
}
