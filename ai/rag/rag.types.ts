export type EmbeddingVector = number[];

export interface RetrievedDocument {
  id: string;
  content: string;
  score: number | null;
  metadata?: Record<string, any>;
}