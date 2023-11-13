import { ChatCompletionMessageParam } from 'openai/resources';

export const createSharedFileMessage = (
  path: string,
  content: string,
): ChatCompletionMessageParam => {
  return {
    role: 'user',
    content: `${path}:\n\`\`\`\n${content}\n\`\`\``,
  };
};
