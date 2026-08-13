import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";

import { PatientsService } from "./patients.service";
import { UpdatePatientDto } from "./dto/update-patient.dto";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

import { AddPatientAllergyDto } from "./dto/add-patient-allergy.dto";
import { UpdatePatientAllergyDto } from "./dto/update-patient-allergy.dto";

import { AddPatientConditionDto } from "./dto/add-patient-condition.dto";
import { UpdatePatientConditionDto } from "./dto/update-patient-condition.dto";

@Controller("patients")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PATIENT)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get("me")
  async getMyProfile(@Request() req: any) {
    return this.patientsService.getMyProfile(req.user.id);
  }

  @Patch("me")
  async updateMyProfile(@Request() req: any, @Body() dto: UpdatePatientDto) {
    return this.patientsService.updateMyProfile(req.user.id, dto);
  }

  @Get("me/allergies")
  async getMyAllergies(@Request() req: any) {
    return this.patientsService.getMyAllergies(req.user.id);
  }

  @Post("me/allergies")
  async addMyAllergy(@Request() req: any, @Body() dto: AddPatientAllergyDto) {
    return this.patientsService.addMyAllergy(req.user.id, dto);
  }
  
  @Patch("me/allergies/:allergyId")
  async updateMyAllergy(
    @Request() req: any,
    @Param("allergyId") allergyId: string,
    @Body() dto: UpdatePatientAllergyDto,
  ) {
    return this.patientsService.updateMyAllergy(req.user.id, allergyId, dto);
  }

  @Delete("me/allergies/:allergyId")
  async deleteMyAllergy(
    @Request() req: any,
    @Param("allergyId") allergyId: string,
  ) {
    return this.patientsService.deleteMyAllergy(req.user.id, allergyId);
  }

  @Get("me/conditions")
async getMyConditions(@Request() req: any) {
  return this.patientsService.getMyConditions(
    req.user.id,
  );
}

@Post("me/conditions")
async addMyCondition(
  @Request() req: any,
  @Body() dto: AddPatientConditionDto,
) {
  return this.patientsService.addMyCondition(
    req.user.id,
    dto,
  );
}

@Patch("me/conditions/:conditionId")
async updateMyCondition(
  @Request() req: any,
  @Param("conditionId") conditionId: string,
  @Body() dto: UpdatePatientConditionDto,
) {
  return this.patientsService.updateMyCondition(
    req.user.id,
    conditionId,
    dto,
  );
}

@Delete("me/conditions/:conditionId")
async deleteMyCondition(
  @Request() req: any,
  @Param("conditionId") conditionId: string,
) {
  return this.patientsService.deleteMyCondition(
    req.user.id,
    conditionId,
  );
}
}
