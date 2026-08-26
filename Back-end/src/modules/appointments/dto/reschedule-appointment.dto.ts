import { IsDateString, IsInt, Min, IsOptional } from "class-validator";

export class RescheduleAppointmentDto {
  @IsDateString()
  scheduledAt!: string;

  @IsInt()
  @Min(5)
  @IsOptional()
  durationMinutes?: number;
}