export interface AiProvider {
  ask(question: string): Promise<string>;
}
