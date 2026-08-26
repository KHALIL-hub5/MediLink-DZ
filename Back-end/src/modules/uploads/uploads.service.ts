import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StorageService } from './storage/storage.interface';
import { UploadCategory } from '@prisma/client';

@Injectable()
export class UploadsService {
  constructor(
    private prisma: PrismaService,
    @Inject('STORAGE_SERVICE') private storage: StorageService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    category: UploadCategory,
    userId: string,
  ) {
    const folder = String(category).toLowerCase();
    const result = await this.storage.upload(file, folder);

    return this.prisma.fileUpload.create({
      data: {
        uploadedById: userId,
        url: result.url,
        originalName: result.originalName,
        mimeType: result.mimeType,
        size: result.size,
        category,
      },
    });
  }
}
