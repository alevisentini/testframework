// ai/rag/rag.types.ts

export interface RagDocument {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface RagFallbackResponse {
  insufficientContext: true;
  answer: string;
  sources: [];
  minDistance: number;
  threshold: number;
}

export interface RagSuccessResponse {
  insufficientContext?: false;
  documents: string[][];
  metadatas: Record<string, any>[][];
  distances: number[][];
}

export type RagQueryResult = RagFallbackResponse | RagSuccessResponse;



