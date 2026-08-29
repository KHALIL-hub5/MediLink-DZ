import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
} from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";

import { ChatbotService } from "./chatbot.service";

import { SendMessageDto } from "./dto/send-message.dto";

import { AI_MODELS } from "./providers/ai-models.config";

type AuthenticatedUser = {
  id: string;
};

@Controller("chatbot")
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get("models")
  getModels() {
    return AI_MODELS;
  }

  @Post("messages")
  sendMessage(
    @CurrentUser()
    user: AuthenticatedUser,

    @Body()
    dto: SendMessageDto,
  ) {
    return this.chatbotService.sendMessage(user.id, dto);
  }

  @Get("conversations")
  getConversations(
    @CurrentUser()
    user: AuthenticatedUser,
  ) {
    return this.chatbotService.getConversations(user.id);
  }

  @Get("conversations/:conversationId")
  getConversation(
    @CurrentUser()
    user: AuthenticatedUser,

    @Param("conversationId", ParseUUIDPipe)
    conversationId: string,
  ) {
    return this.chatbotService.getConversation(user.id, conversationId);
  }

  @Delete("conversations/:conversationId")
  deleteConversation(
    @CurrentUser()
    user: AuthenticatedUser,

    @Param("conversationId", ParseUUIDPipe)
    conversationId: string,
  ) {
    return this.chatbotService.deleteConversation(user.id, conversationId);
  }
}
