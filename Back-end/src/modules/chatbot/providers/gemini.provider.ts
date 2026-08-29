import {
  Injectable,
} from "@nestjs/common";

import {
  ConfigService,
} from "@nestjs/config";

import {
  GoogleGenAI,
} from "@google/genai";

import {
  AiGenerateInput,
  AiGenerateResult,
} from "./ai-provider.interface";

@Injectable()
export class GeminiProvider {
  private readonly client: GoogleGenAI;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.client = new GoogleGenAI({
      apiKey:
        this.configService.getOrThrow<string>(
          "GEMINI_API_KEY",
        ),
    });
  }

  async generate(
    input: AiGenerateInput,
  ): Promise<AiGenerateResult> {
    const response =
      await this.client.models.generateContent({
        model: input.model,

        contents: input.messages.map((message) => ({
          role:
            message.role === "assistant"
              ? "model"
              : "user",

          parts: [
            {
              text: message.content,
            },
          ],
        })),

        config: {
          systemInstruction:
            input.systemPrompt,
        },
      });

    return {
      text: response.text ?? "",
    };
  }
}