// specialties.module.ts
import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtiesService } from './specialties.service';

@Module({
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService],
  exports: [SpecialtiesService], // export in case `doctors` module needs to validate specialty existence
})
export class SpecialtiesModule {}