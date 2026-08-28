import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { PatientDocumentType } from "@prisma/client";

export class UploadPatientDocumentDto {
  @IsEnum(PatientDocumentType)
  type!: PatientDocumentType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
