import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class UpdateInventoryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice?: number;
}