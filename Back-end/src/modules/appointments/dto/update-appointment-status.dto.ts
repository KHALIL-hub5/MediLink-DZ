import { IsEnum, IsString, IsOptional, MaxLength } from "class-validator";
import { AppointmentStatus } from "@prisma/client";

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus;

  // required when status is REJECTED, optional otherwise — enforce in service, not DTO
  @IsString()
  @IsOptional()
  @MaxLength(500)
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  doctorNotes?: string;
}