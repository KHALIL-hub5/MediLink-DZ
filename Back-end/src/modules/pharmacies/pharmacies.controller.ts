import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { PharmaciesService } from "./pharmacies.service";

import { UpdateInventoryDto } from "./dto/update-inventory.dto";
import { DispensePrescriptionDto } from "./dto/dispense-prescription.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller("pharmacies")
export class PharmaciesController {
  constructor(
    private readonly pharmaciesService: PharmaciesService,
  ) {}

  // =========================================================
  // PHARMACY STAFF
  // =========================================================

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async getMyPharmacy(@Request() req: any) {
    return this.pharmaciesService.getMyPharmacy(
      req.user.id,
    );
  }

  // =========================================================
  // INVENTORY
  // =========================================================

  @Get("me/inventory")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async getMyInventory(@Request() req: any) {
    return this.pharmaciesService.getMyInventory(
      req.user.id,
    );
  }

  @Patch("me/inventory/:medicationId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async updateInventory(
    @Request() req: any,
    @Param("medicationId", ParseUUIDPipe)
    medicationId: string,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.pharmaciesService.updateInventory(
      req.user.id,
      medicationId,
      dto,
    );
  }

  // =========================================================
  // PRESCRIPTION ACCESS
  // =========================================================

  @Get("me/prescriptions/:prescriptionId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async getPrescription(
    @Request() req: any,
    @Param("prescriptionId", ParseUUIDPipe)
    prescriptionId: string,
  ) {
    return this.pharmaciesService.getPrescription(
      req.user.id,
      prescriptionId,
    );
  }

  // =========================================================
  // DISPENSING
  // =========================================================

  @Post(
    "me/prescriptions/:prescriptionId/dispense",
  )
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async dispensePrescription(
    @Request() req: any,
    @Param("prescriptionId", ParseUUIDPipe)
    prescriptionId: string,
    @Body() dto: DispensePrescriptionDto,
  ) {
    return this.pharmaciesService.dispensePrescription(
      req.user.id,
      prescriptionId,
      dto,
    );
  }

  // =========================================================
  // DISPENSING HISTORY
  // =========================================================

  @Get("me/dispensings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async getDispensings(@Request() req: any) {
    return this.pharmaciesService.getDispensings(
      req.user.id,
    );
  }

  @Get("me/dispensings/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PHARMACY_STAFF)
  async getDispensing(
    @Request() req: any,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.pharmaciesService.getDispensing(
      req.user.id,
      id,
    );
  }

  // =========================================================
  // PUBLIC PHARMACIES
  // Keep dynamic :id BELOW "me" routes.
  // =========================================================

  @Get()
  async findAll() {
    return this.pharmaciesService.findAll();
  }

  @Get(":id")
  async findOne(
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.pharmaciesService.findOne(id);
  }
}