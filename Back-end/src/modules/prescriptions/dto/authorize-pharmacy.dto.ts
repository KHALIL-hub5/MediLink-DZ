import { IsUUID } from "class-validator";

export class AuthorizePharmacyDto {
  @IsUUID()
  pharmacyId!: string;
}