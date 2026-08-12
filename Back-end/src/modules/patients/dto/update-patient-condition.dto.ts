import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { ConditionStatus } from "@prisma/client";

export class UpdatePatientConditionDto {
  @IsOptional()
  @IsEnum(ConditionStatus)
  status?: ConditionStatus;

  @IsOptional()
  @IsDateString()
  diagnosedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}