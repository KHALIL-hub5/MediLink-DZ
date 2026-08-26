import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
  async findMe(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
      },
    });
  }
  
  async update(userId: string, dto: any) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },

      data: dto,
    });
  }
}
