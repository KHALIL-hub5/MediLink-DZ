import { Controller, Get } from '@nestjs/common';
@Controller('medical-records')
export class MedicalRecordsController {
  @Get()
  findAll() {
    return [];
  }
}
