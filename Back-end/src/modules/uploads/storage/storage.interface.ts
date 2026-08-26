export interface UploadResult {
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface StorageService {
  upload(file: Express.Multer.File, folder: string): Promise<UploadResult>;
}