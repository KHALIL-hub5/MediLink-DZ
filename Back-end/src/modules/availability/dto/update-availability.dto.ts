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

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @IsOptional()
  @IsEnum(DayOfWeek)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1439)
  startMinute?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1440)
  endMinute?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  slotDurationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}