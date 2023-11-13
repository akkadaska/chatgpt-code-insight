import { createChatCompletionCreateParamsStreaming } from './adapters/request/create-chat-completion-create-params';
import { CodeInsightResponseStreamImpl } from './adapters/response/response-stream';
import { CodeInsightRequest, CodeInsightResponseStream } from './types';

export type RunCodeInsight = (
  request: CodeInsightRequest,
) => Promise<CodeInsightResponseStream>;

export const runCodeInsight: RunCodeInsight = async (request) => {
  const chatCompletionCreateParams = createChatCompletionCreateParamsStreaming(
    request.model,
    request.messages,
    request.references,
    request.openAiChatCompletionOptions,
  );

  return request.openai.chat.completions
    .create(chatCompletionCreateParams, {
      ...request.openAIChatCompletionRequestOptions,
      stream: true,
    })
    .then((response) => new CodeInsightResponseStreamImpl(response));
};
