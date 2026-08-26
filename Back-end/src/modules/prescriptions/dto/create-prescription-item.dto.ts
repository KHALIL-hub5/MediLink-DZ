import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";
import { MedicationForm } from "@prisma/client";

export class CreatePrescriptionItemDto {
  @IsOptional()
  @IsUUID()
  medicationId?: string;

  @IsString()
  @MaxLength(200)
  medicationName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  brandName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  strength?: string;

  @IsOptional()
  @IsEnum(MedicationForm)
  form?: MedicationForm;

  @IsString()
  @MaxLength(100)
  dosage!: string;

  @IsString()
  @MaxLength(150)
  frequency!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  route?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}
