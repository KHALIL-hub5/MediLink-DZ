import { Controller, Get } from '@nestjs/common';
@Controller('audit-logs')
export class AuditLogsController {
  @Get()
  findAll() {
    return [];
  }
}
