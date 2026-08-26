import {
  Controller, Post, UseInterceptors, UploadedFile, Body, Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload.dto';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
    @Req() req: any,
  ) {
    return this.uploadsService.uploadFile(file, dto.category, req.user.id);
  }
}