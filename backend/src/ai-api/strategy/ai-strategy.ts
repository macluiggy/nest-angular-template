export default interface AiStrategy {
  /**
   * chatCompletion - This function is used to send a prompt to the AI model and get a response
   * @param prompt - The prompt to be sent to the AI model
   */
  chatCompletion({ prompt }: { prompt: string }): Promise<{
    outputResponse: string;
  }>;
}
