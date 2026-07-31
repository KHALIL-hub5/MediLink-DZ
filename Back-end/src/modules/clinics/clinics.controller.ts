import { Controller, Get } from '@nestjs/common';
@Controller('clinics')
export class ClinicsController {
  @Get()
  findAll() {
    return [];
  }
}
