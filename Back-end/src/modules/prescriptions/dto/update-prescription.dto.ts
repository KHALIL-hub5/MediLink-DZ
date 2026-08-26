import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}