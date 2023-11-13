export type CodeInsightMessageResponseChunk = {
  type: 'message';
  content: string;
};

export type CodeInsightFileRequestCompleteResponseChunk = {
  type: 'file-request-complete';
  files: string[];
};

export type CodeInsightSkippingResponseChunk = {
  type: 'no-response';
};

export type CodeInsightResponseFinishChunk = {
  type: 'finish';
  reason: string;
};

export type CodeInsightResponseChunk =
  | CodeInsightMessageResponseChunk
  | CodeInsightFileRequestCompleteResponseChunk
  | CodeInsightSkippingResponseChunk
  | CodeInsightResponseFinishChunk;

export interface CodeInsightResponseStream
  extends AsyncIterable<CodeInsightResponseChunk> {
  abort(): void;
}
