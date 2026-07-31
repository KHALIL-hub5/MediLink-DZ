import { Controller, Get } from '@nestjs/common';
@Controller('pharmacies')
export class PharmaciesController {
  @Get()
  findAll() {
    return [];
  }
}
