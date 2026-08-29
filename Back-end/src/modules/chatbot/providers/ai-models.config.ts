import { $Enums } from "@prisma/client";

export const AiProvider = $Enums.AiProvider;
export type AiProvider = $Enums.AiProvider;

export const AI_MODELS: Record<AiProvider, readonly string[]> = {
  [AiProvider.OPENAI]: [
    "gpt-5.4",
    "gpt-5.4-mini",
    "gpt-5.4-nano",
  ],

  [AiProvider.GEMINI]: [
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
  ],

  [AiProvider.ANTHROPIC]: [
    "claude-sonnet-5",
    "claude-opus-5",
    "claude-haiku-4-5",
  ],
};

export function isSupportedModel(
  provider: AiProvider,
  model: string,
): boolean {
  return AI_MODELS[provider]?.includes(model) ?? false;
}
