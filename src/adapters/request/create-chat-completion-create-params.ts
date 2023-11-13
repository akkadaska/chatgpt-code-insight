import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import {
  CodeInsightRequestChatGPTModel,
  CodeInsightRequestMessage,
  CodeInsightRequestReference,
  OpenAIChatCompletionParamsOptions,
} from '../../types';
import { REQUEST_FILE_FUNCTION } from '../functions/request-file';
import { createDirectoryStructureMessage } from './message/create-directory-structure-message';
import { createSharedFileMessage } from './message/create-shared-file-message';
import { functionReminderMessage } from './message/introduction-message';

const convertMessages = (
  codeInsightMessage: CodeInsightRequestMessage,
): ChatCompletionMessageParam => {
  if (codeInsightMessage.role === 'user') {
    return {
      role: 'user',
      content: codeInsightMessage.content,
    };
  } else {
    return {
      role: 'assistant',
      content: codeInsightMessage.content,
    };
  }
};

export const createChatCompletionCreateParamsStreaming = (
  model: CodeInsightRequestChatGPTModel,
  messages: CodeInsightRequestMessage[],
  references: CodeInsightRequestReference,
  options?: OpenAIChatCompletionParamsOptions,
): ChatCompletionCreateParamsStreaming => {
  const directoryStructureMessage = createDirectoryStructureMessage(
    references.directoryStructure,
  );

  const sharedFileMessages = Object.entries(references.sharedFiles).map(
    ([path, content]) => createSharedFileMessage(path, content),
  );

  const conversationMessages = messages.map(convertMessages);

  return {
    ...options,
    model,
    messages: [
      directoryStructureMessage,
      ...sharedFileMessages,
      ...conversationMessages,
      functionReminderMessage,
    ],
    function_call: 'auto',
    functions: [REQUEST_FILE_FUNCTION.FUNCTION],
    stream: true,
  };
};
