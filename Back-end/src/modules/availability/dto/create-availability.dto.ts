import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { DayOfWeek } from "@prisma/client";

export class CreateAvailabilityDto {
  @IsUUID()
  clinicId!: string;

  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1439)
  startMinute!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1440)
  endMinute!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  slotDurationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}