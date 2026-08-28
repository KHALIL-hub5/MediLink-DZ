import { IsEnum } from "class-validator";
import { VerificationDocumentType } from "@prisma/client";

export class UploadDoctorDocumentDto {
  @IsEnum(VerificationDocumentType)
  type!: VerificationDocumentType;
}
