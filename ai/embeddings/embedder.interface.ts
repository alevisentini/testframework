export type EmbeddingVector = number[];

export interface IEmbedder {
  embed(text: string): Promise<number[]>;
}