import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { ConditionStatus } from "@prisma/client";

export class AddPatientConditionDto {
  @IsUUID()
  conditionId!: string;

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
