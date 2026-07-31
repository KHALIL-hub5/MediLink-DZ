import { Controller, Get } from '@nestjs/common';
@Controller('specialties')
export class SpecialtiesController {
  @Get()
  findAll() {
    return [];
  }
}
