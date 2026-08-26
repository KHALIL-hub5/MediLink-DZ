import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class DispensePrescriptionItemDto {
  @IsUUID()
  @IsNotEmpty()
  prescriptionItemId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;
}