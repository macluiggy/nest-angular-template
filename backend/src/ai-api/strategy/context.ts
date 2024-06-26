import AiStrategy from './ai-strategy';

export default class Context implements AiStrategy {
  private strategy: AiStrategy;

  constructor(strategy: AiStrategy) {
    this.strategy = strategy;
  }
  chatCompletion({
    prompt,
  }: {
    prompt: string;
  }): Promise<{ outputResponse: string }> {
    return this.strategy.chatCompletion({ prompt });
  }

  setStrategy(strategy: AiStrategy) {
    this.strategy = strategy;
  }
}
