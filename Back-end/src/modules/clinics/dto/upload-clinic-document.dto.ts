import { IsEnum } from "class-validator";
import { ClinicVerificationDocumentType } from "@prisma/client";

export class UploadClinicDocumentDto {
  @IsEnum(ClinicVerificationDocumentType)
  type!: ClinicVerificationDocumentType;
}
