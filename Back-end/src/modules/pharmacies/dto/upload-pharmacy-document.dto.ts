import { IsEnum } from "class-validator";
import { PharmacyVerificationDocumentType } from "@prisma/client";

export class UploadPharmacyDocumentDto {
  @IsEnum(PharmacyVerificationDocumentType)
  type!: PharmacyVerificationDocumentType;
}
