import { ChatCompletionCreateParams } from 'openai/resources/chat';
import { z } from 'zod';

export const REQUEST_FILE_FUNCTION = {
  FUNCTION: {
    name: 'request_files',
    description:
      'Request additional files (e.g., dependencies) for understanding and addressing your tasks.',
    parameters: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of file paths that you request to share.',
        },
      },
      required: ['files'],
    },
  } as const satisfies ChatCompletionCreateParams.Function,
  ARGUMENT_SCHEMA: z.object({
    files: z.array(z.string()),
  }),
} as const;
