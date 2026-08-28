import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { LocalStorageService } from './storage/local-storage.service';
import { CloudinaryService } from './storage/cloudinary.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    {
      provide: 'STORAGE_SERVICE',
      useClass:
        process.env.STORAGE_DRIVER === 'cloudinary'
          ? CloudinaryService
          : LocalStorageService,
    },
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
