import { Controller, Get } from '@nestjs/common';
@Controller('prescriptions')
export class PrescriptionsController {
  @Get()
  findAll() {
    return [];
  }
}
