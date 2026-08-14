import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsString,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
} from "class-validator";
import { ConsultationType } from "@prisma/client";

export class CreateAppointmentDto {
  @IsUUID()
  doctorId!: string;

  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  durationMinutes?: number;

  @IsEnum(ConsultationType)
  @IsOptional()
  type?: ConsultationType;

  @IsString()
  @MaxLength(500)
  reason!: string;

  @IsString()
  @IsOptional()
  patientNotes?: string;
}
