import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

import { Type } from "class-transformer";

import { VerificationDocumentStatus } from "@prisma/client";

export class DocumentsQueryDto {
  @IsOptional()
  @IsEnum(VerificationDocumentStatus)
  status?: VerificationDocumentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
