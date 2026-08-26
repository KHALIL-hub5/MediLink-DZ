import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateMedicalRecordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
