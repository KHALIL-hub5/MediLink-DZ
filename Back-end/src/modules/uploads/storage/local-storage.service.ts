import { Injectable } from '@nestjs/common';
import { StorageService, UploadResult } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LocalStorageService implements StorageService {
  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const dir = path.join('uploads', folder);
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${uuid()}-${file.originalname}`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, file.buffer);

    return {
      url: `/uploads/${folder}/${filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}