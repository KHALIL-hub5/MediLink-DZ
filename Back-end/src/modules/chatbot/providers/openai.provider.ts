import { AiProvider } from './ai-provider.interface';
export class OpenAiProvider implements AiProvider {
  async ask(question: string) {
    return 'OpenAI response';
  }
}
