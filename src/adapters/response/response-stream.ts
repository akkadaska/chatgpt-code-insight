import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';
import {
  CodeInsightFileRequestCompleteResponseChunk,
  CodeInsightMessageResponseChunk,
  CodeInsightResponseChunk,
  CodeInsightResponseFinishChunk,
  CodeInsightResponseStream,
  CodeInsightSkippingResponseChunk,
} from '../../types';
import { REQUEST_FILE_FUNCTION } from '../functions/request-file';

export class CodeInsightResponseStreamImpl
  implements CodeInsightResponseStream
{
  private readonly functionNameChunks: string[] = [];
  private readonly functionArgumentChunks: string[] = [];
  constructor(private readonly source: Stream<ChatCompletionChunk>) {}

  public abort(): void {
    this.source.controller.abort();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<CodeInsightResponseChunk> {
    for await (const item of this.source) {
      yield this.chunkTransformer(item);
    }
  }

  private chunkTransformer(
    chunk: ChatCompletionChunk,
  ): CodeInsightResponseChunk {
    const { delta, finish_reason: finishReason } = chunk.choices[0];
    if (typeof delta.content === 'string') {
      return {
        type: 'message',
        content: delta.content,
      } satisfies CodeInsightMessageResponseChunk;
    }

    if (delta.function_call?.name) {
      if (delta.function_call?.name === REQUEST_FILE_FUNCTION.FUNCTION.name) {
        this.functionNameChunks.push(delta.function_call.name);
      } else {
        throw new Error(
          `Unexpected function call: ${JSON.stringify(delta.function_call)}`,
        );
      }
    }
    if (typeof delta.function_call?.arguments === 'string') {
      this.functionArgumentChunks.push(delta.function_call.arguments);
      return {
        type: 'no-response',
      } satisfies CodeInsightSkippingResponseChunk;
    }

    if (finishReason === 'function_call') {
      if (this.functionNameChunks.length !== 1) {
        throw new Error(
          `Unexpected function name chunks: ${JSON.stringify(
            this.functionNameChunks,
          )}`,
        );
      }
      try {
        const args = REQUEST_FILE_FUNCTION.ARGUMENT_SCHEMA.parse(
          JSON.parse(this.functionArgumentChunks.join('')),
        );
        return {
          type: 'file-request-complete',
          files: args.files,
        } satisfies CodeInsightFileRequestCompleteResponseChunk;
      } catch (error) {
        throw new Error(`Failed to parse function calling arguments: ${error}`);
      }
    }

    if (finishReason) {
      return {
        type: 'finish',
        reason: finishReason,
      } satisfies CodeInsightResponseFinishChunk;
    }

    throw new Error(`Unexpected ChatCompletionChunk: ${JSON.stringify(chunk)}`);
  }
}
