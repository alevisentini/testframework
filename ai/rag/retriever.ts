import { ChromaClientWrapper } from "../vectordb/chroma.client";
import { Embedder } from "../embeddings/embedder";
import { RetrievedDocument } from "./rag.types";

export class Retriever {
  constructor(
    private chroma: ChromaClientWrapper,
    private embedder: Embedder
  ) {}

  async retrieve(query: string, limit = 3): Promise<RetrievedDocument[]> {
    // 1. Embed the query
    const embedding = await this.embedder.embed(query);

    // 2. Query vector DB
    const result = await this.chroma.query(embedding, limit);

    // Chroma returns arrays inside arrays:
    // result.ids[0] → string[]
    // result.documents[0] → (string | null)[]
    // result.distances?.[0] → number[]
    // result.metadatas?.[0] → object[]

    const ids = result.ids?.[0] || [];
    const docs = result.documents?.[0] || [];
    const scores = result.distances?.[0] || [];
    const metas = result.metadatas?.[0] || [];

    // 3. Build RetrievedDocument[]
    const formatted: RetrievedDocument[] = ids.map((id, i) => ({
      id,
      content: docs[i] ?? "",
      score: scores[i] ?? null,
      metadata: metas[i] || {}
    }));

    return formatted;
  }
}
