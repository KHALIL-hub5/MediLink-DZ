import { Controller, Get, Query } from '@nestjs/common';
@Controller('chatbot')
export class ChatbotController {
  @Get()
  ask(@Query('q') q: string) {
    return { answer: 'Hello' };
  }
}
