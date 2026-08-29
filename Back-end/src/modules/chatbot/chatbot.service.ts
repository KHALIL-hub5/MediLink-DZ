import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../../database/prisma.service";

import { AiProviderFactory } from "./providers/provider.factory";

import { SendMessageDto } from "./dto/send-message.dto";

import { isSupportedModel } from "./providers/ai-models.config";

@Injectable()
export class ChatbotService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly providerFactory: AiProviderFactory,
  ) {}

  async sendMessage(userId: string, dto: SendMessageDto) {
    // 1. Validate selected model
    if (!isSupportedModel(dto.provider, dto.model)) {
      throw new BadRequestException(
        `Model ${dto.model} is not available for ${dto.provider}`,
      );
    }

    // 2. Find or create conversation
    let conversation;

    if (dto.conversationId) {
      conversation = await this.prisma.chatConversation.findFirst({
        where: {
          id: dto.conversationId,
          userId,
        },
      });

      if (!conversation) {
        throw new NotFoundException("Conversation not found");
      }
    } else {
      conversation = await this.prisma.chatConversation.create({
        data: {
          userId,
        },
      });
    }

    // 3. Save user message
    await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: dto.message,
      },
    });

    // 4. Load conversation history
    const messages = await this.prisma.chatMessage.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const history = messages.map((message) => ({
      role:
        message.role === "USER" ? ("user" as const) : ("assistant" as const),

      content: message.content,
    }));

    // =========================================
    // 5. THIS IS WHERE providerFactory.get GOES
    // =========================================

    const provider = this.providerFactory.get(dto.provider);

    // 6. Call selected AI provider
    const result = await provider.generate({
      model: dto.model,

      systemPrompt: "You are MediLink DZ Health Assistant.",

      messages: history,
    });

    // 7. Save AI response
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,

        role: "ASSISTANT",

        content: result.text,

        provider: dto.provider,

        model: dto.model,

        inputTokens: result.inputTokens,

        outputTokens: result.outputTokens,
      },
    });

    // 8. Return response
    return {
      conversationId: conversation.id,

      messageId: assistantMessage.id,

      provider: dto.provider,

      model: dto.model,

      answer: result.text,
    };
  }

  async getConversations(userId: string) {
    return this.prisma.chatConversation.findMany({
      where: {
        userId,
      },

      orderBy: {
        updatedAt: "desc",
      },

      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,

        messages: {
          take: 1,

          orderBy: {
            createdAt: "desc",
          },

          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return conversation;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.chatConversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    await this.prisma.chatConversation.delete({
      where: {
        id: conversationId,
      },
    });

    return {
      message: "Conversation deleted successfully",
    };
  }
}
