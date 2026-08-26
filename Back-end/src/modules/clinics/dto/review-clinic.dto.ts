import { OrganizationStatus } from "@prisma/client";
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class ReviewClinicDto {
  @IsIn([
    OrganizationStatus.UNDER_REVIEW,
    OrganizationStatus.APPROVED,
    OrganizationStatus.REJECTED,
  ])
  status!: OrganizationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}