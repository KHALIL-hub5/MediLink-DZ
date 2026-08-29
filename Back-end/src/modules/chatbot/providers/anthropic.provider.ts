import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import Anthropic from "@anthropic-ai/sdk";

import { AiGenerateInput, AiGenerateResult } from "./ai-provider.interface";

@Injectable()
export class AnthropicProvider {
  private readonly client: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.client = new Anthropic({
      apiKey: this.configService.getOrThrow<string>("ANTHROPIC_API_KEY"),
    });
  }

  async generate(input: AiGenerateInput): Promise<AiGenerateResult> {
    const response = await this.client.messages.create({
      model: input.model,

      system: input.systemPrompt,

      max_tokens: 2048,

      messages: input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return {
      text,

      inputTokens: response.usage.input_tokens,

      outputTokens: response.usage.output_tokens,

      providerRequestId: response.id,
    };
  }
}
