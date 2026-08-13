import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateDoctorProfileDto {
  @IsString()
  @MaxLength(100)
  licenseNumber!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultConsultationPrice?: number;

  @IsOptional()
  @IsBoolean()
  acceptsOnlineBooking?: boolean;
}