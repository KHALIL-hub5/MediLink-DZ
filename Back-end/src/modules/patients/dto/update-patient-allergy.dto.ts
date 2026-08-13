import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
import { AllergySeverity } from "@prisma/client";

export class UpdatePatientAllergyDto {
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