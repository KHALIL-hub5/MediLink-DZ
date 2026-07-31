import { Controller, Post } from '@nestjs/common';
@Controller('uploads')
export class UploadsController {
  @Post()
  upload() {
    return { success: true };
  }
}
