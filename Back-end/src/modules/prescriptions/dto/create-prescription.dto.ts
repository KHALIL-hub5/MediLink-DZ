import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

import { CreatePrescriptionItemDto } from "./create-prescription-item.dto";

export class CreatePrescriptionDto {
  @IsUUID()
  medicalRecordId!: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items!: CreatePrescriptionItemDto[];
}
