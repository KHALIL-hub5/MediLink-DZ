import { IsString, MaxLength, IsOptional } from "class-validator";

export class CancelAppointmentDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  cancellationReason?: string;
}