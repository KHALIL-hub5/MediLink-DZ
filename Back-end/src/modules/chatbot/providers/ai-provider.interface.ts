export type AiChatRole = "user" | "assistant";

export type AiChatMessage = {
  role: AiChatRole;
  content: string;
};

export type AiGenerateInput = {
  model: string;
  systemPrompt: string;
  messages: AiChatMessage[];
};

export type AiGenerateResult = {
  text: string;

  inputTokens?: number;
  outputTokens?: number;

  providerRequestId?: string;
};