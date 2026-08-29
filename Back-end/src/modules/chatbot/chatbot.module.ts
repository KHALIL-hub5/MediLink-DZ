import { Module } from "@nestjs/common";

import { ChatbotController } from "./chatbot.controller";

import { ChatbotService } from "./chatbot.service";

import { OpenAiProvider } from "./providers/openai.provider";

import { GeminiProvider } from "./providers/gemini.provider";

import { AnthropicProvider } from "./providers/anthropic.provider";

import { AiProviderFactory } from "./providers/provider.factory";

import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],

  controllers: [ChatbotController],

  providers: [
    ChatbotService,

    OpenAiProvider,
    GeminiProvider,
    AnthropicProvider,

    AiProviderFactory,
  ],

  exports: [ChatbotService],
})
export class ChatbotModule {}
