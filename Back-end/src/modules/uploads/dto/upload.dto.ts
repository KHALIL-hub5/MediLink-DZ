import { IsEnum } from 'class-validator';
import { UploadCategory } from '@prisma/client';

export class UploadFileDto {
  @IsEnum(UploadCategory)
  category!: UploadCategory;
}
