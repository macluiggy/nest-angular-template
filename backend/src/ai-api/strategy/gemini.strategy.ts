import AiStrategy from './ai-strategy';

export default class GeminiStrategy implements AiStrategy {
  // TODO: later add the constructor to add the configuration from google to add the api key
  chatCompletion({
    prompt,
  }: {
    prompt: string;
  }): Promise<{ outputResponse: string }> {
    return new Promise((resolve) => {
      const outputResponse = 'This is a response from the Gemini Strategy';
      resolve({ outputResponse: prompt + outputResponse });
    });
  }
}
