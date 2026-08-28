import { BadRequestException, Injectable } from "@nestjs/common";

import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

import { StorageService, UploadResult } from "./storage.interface";

@Injectable()
export class CloudinaryService implements StorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

      api_key: process.env.CLOUDINARY_API_KEY,

      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadResult> {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    if (!file.buffer) {
      throw new BadRequestException("File buffer is missing");
    }

    const isPdf = file.mimetype === "application/pdf";

    const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype,
    );

    // -----------------------------------------
    // Validate actual PDF bytes
    // -----------------------------------------

    if (isPdf) {
      const signature = file.buffer.subarray(0, 5).toString("ascii");

      if (signature !== "%PDF-") {
        throw new BadRequestException("The uploaded file is not a valid PDF");
      }
    }

    // -----------------------------------------
    // Reject unsupported file types
    // -----------------------------------------

    if (!isPdf && !isImage) {
      throw new BadRequestException(`Unsupported file type: ${file.mimetype}`);
    }

    /*
     * PDF/document -> RAW
     * Avatar/image -> IMAGE
     */
    const resourceType: "raw" | "image" = isPdf ? "raw" : "image";

    /*
     * RAW assets need the extension in public_id.
     * Images don't need it.
     */
    const publicId = isPdf ? `${randomUUID()}.pdf` : randomUUID();

    return new Promise<UploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `medilinkdz/${folder}`,

          resource_type: resourceType,

          public_id: publicId,

          overwrite: false,
        },

        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary returned no upload result"));
          }

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
