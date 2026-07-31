import { Controller, Get } from '@nestjs/common';
@Controller('doctors')
export class DoctorsController {
  @Get()
  findAll() {
    return [];
  }
}
