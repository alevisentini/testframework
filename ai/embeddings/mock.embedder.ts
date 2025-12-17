import { IEmbedder, EmbeddingVector } from "./embedder.interface";

export class MockEmbedder implements IEmbedder {
  async embed(text: string): Promise<EmbeddingVector> {
    const size = 1536;

    // Embedding determinístico
    return Array.from({ length: size }, (_, i) =>
      Math.sin(i + text.length)
    );
  }
}