import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

import { DispensePrescriptionItemDto } from "./dispense-prescription-item.dto";

export class DispensePrescriptionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DispensePrescriptionItemDto)
  items!: DispensePrescriptionItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}