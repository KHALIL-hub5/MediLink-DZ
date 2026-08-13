import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { AllergySeverity } from "@prisma/client";

export class AddPatientAllergyDto {
  @IsUUID()
  allergyId!: string;

  @IsOptional()
  @IsEnum(AllergySeverity)
  severity?: AllergySeverity;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reaction?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}