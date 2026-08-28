import { IsEnum, IsUUID } from "class-validator";

import { VerificationDocumentType } from "@prisma/client";

export class AddClinicDocumentDto {
  @IsUUID()
  uploadId!: string;

  @IsEnum(VerificationDocumentType)
  type!: VerificationDocumentType;
}
