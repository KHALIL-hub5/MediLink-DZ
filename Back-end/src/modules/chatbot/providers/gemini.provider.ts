import { AiProvider } from './ai-provider.interface';
export class GeminiProvider implements AiProvider {
  async ask(question: string) {
    return 'Gemini response';
  }
}
