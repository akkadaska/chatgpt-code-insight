import OpenAI from 'openai';
import { RequestOptions } from 'openai/core';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export const CODE_INSIGHT_REQUEST_CHAT_GPT_MODELS = {
  GPT4_TURBO: 'gpt-4-1106-preview',
  GPT4_32K: 'gpt-4-32k-0613',
  GPT4: 'gpt-4-0613',
  GPT35_TURBO_16K: 'gpt-3.5-turbo-16k-0613',
  GPT35_TURBO: 'gpt-3.5-turbo-0613',
} as const;

export type CodeInsightRequestChatGPTModel =
  (typeof CODE_INSIGHT_REQUEST_CHAT_GPT_MODELS)[keyof typeof CODE_INSIGHT_REQUEST_CHAT_GPT_MODELS];

export type CodeInsightRequestFile = {
  name: string;
  type: 'file';
};

export type CodeInsightRequestDirectory = {
  name: string;
  type: 'directory';
  children: Array<CodeInsightRequestFile | CodeInsightRequestDirectory>;
};

export type CodeInsightRequestDirectoryStructure = CodeInsightRequestDirectory;

export type CodeInsightRequestReference = {
  directoryStructure: CodeInsightRequestDirectoryStructure;
  sharedFiles: Record<string, string>;
};

export type CodeInsightRequestUserMessage = {
  role: 'user';
  content: string;
};

export type CodeInsightRequestAssistantMessage = {
  role: 'assistant';
  content: string;
};

export type CodeInsightRequestMessage =
  | CodeInsightRequestUserMessage
  | CodeInsightRequestAssistantMessage;

export type OpenAIChatCompletionRequestOptions = Omit<RequestOptions, 'stream'>;

export type OpenAIChatCompletionParamsOptions = Omit<
  ChatCompletionCreateParamsBase,
  'model' | 'messages' | 'function_call' | 'functions' | 'stream'
>;

export type CodeInsightRequest = {
  openai: OpenAI;
  model: CodeInsightRequestChatGPTModel;
  messages: CodeInsightRequestMessage[];
  references: CodeInsightRequestReference;
  openAIChatCompletionRequestOptions?: OpenAIChatCompletionRequestOptions;
  openAiChatCompletionOptions?: OpenAIChatCompletionParamsOptions;
};
