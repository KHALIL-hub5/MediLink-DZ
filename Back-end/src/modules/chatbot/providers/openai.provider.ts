import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import OpenAI from "openai";

import { AiGenerateInput, AiGenerateResult } from "./ai-provider.interface";

@Injectable()
export class OpenAiProvider {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>("OPENAI_API_KEY"),
    });
  }

  async generate(input: AiGenerateInput): Promise<AiGenerateResult> {
    const response = await this.client.responses.create({
      model: input.model,

      instructions: input.systemPrompt,

      input: input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return {
      text: response.output_text,

      inputTokens: response.usage?.input_tokens,

      outputTokens: response.usage?.output_tokens,

      providerRequestId: response.id,
    };
  }
}
