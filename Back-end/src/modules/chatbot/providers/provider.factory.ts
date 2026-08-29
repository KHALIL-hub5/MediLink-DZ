import { BadRequestException, Injectable } from "@nestjs/common";

import { AiProvider } from "@prisma/client";

import { OpenAiProvider } from "./openai.provider";

import { GeminiProvider } from "./gemini.provider";

import { AnthropicProvider } from "./anthropic.provider";

@Injectable()
export class AiProviderFactory {
  constructor(
    private readonly openAi: OpenAiProvider,

    private readonly gemini: GeminiProvider,

    private readonly anthropic: AnthropicProvider,
  ) {}

  get(provider: AiProvider) {
    switch (provider) {
      case AiProvider.OPENAI:
        return this.openAi;

      case AiProvider.GEMINI:
        return this.gemini;

      case AiProvider.ANTHROPIC:
        return this.anthropic;

      default:
        throw new BadRequestException("Unsupported AI provider");
    }
  }
}
