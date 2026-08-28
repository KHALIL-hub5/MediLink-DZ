import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

import { VerificationDocumentStatus } from "@prisma/client";

export class ReviewDocumentDto {
  @IsIn([
    VerificationDocumentStatus.ACCEPTED,
    VerificationDocumentStatus.REJECTED,
  ])
  status!: VerificationDocumentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reviewNote?: string;
}
