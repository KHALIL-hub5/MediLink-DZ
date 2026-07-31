import { Controller, Get } from '@nestjs/common';
@Controller('availability')
export class AvailabilityController {
  @Get()
  findAll() {
    return [];
  }
}
