import { Injectable } from '@nestjs/common';
import AiStrategy from './strategy/ai-strategy';
import Context from './strategy/context';
import HuggingFaceStrategy from './strategy/huggingface.strategy';

@Injectable()
export class AiApiService implements AiStrategy {
  private context: Context;

  constructor() {
    this.context = new Context(new HuggingFaceStrategy());
  }

  setStrategy(strategy: AiStrategy) {
    this.context.setStrategy(strategy);
  }
  chatCompletion({
    prompt,
  }: {
    prompt: string;
  }): Promise<{ outputResponse: string }> {
    return this.context.chatCompletion({ prompt });
  }
}
