import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { StorageService, UploadResult } from './storage.interface';

@Injectable()
export class CloudinaryService implements StorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `medilinkdz/${folder}`, resource_type: 'auto' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          });
        },
      );
      stream.end(file.buffer);
    });
  }
}