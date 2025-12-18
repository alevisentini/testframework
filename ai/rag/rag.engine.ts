import { ChromaClient, Collection } from "chromadb";
import { IEmbedder } from "../embeddings/embedder.interface";
import { RagDocument } from "./rag.types";

/**
 * Default distance threshold.
 * Lower = stricter relevance.
 * This value works well for MiniLM / OpenAI-style embeddings.
 */
const DEFAULT_THRESHOLD = 1.2;

export interface RagFallbackResponse {
  answer: string;
  sources: [];
  insufficientContext: true;
}

export const FALLBACK_RESPONSE: RagFallbackResponse = {
  answer:
    "I don’t have enough relevant information in my QA knowledge base to answer this reliably.",
  sources: [],
  insufficientContext: true,
};

export class RagEngine {
  private client: ChromaClient;
  private collection!: Collection;

  constructor(
    private readonly collectionName: string,
    private readonly embedder: IEmbedder
  ) {
    this.client = new ChromaClient();
  }

  /**
   * Must be called before any add/query operation
   */
  async init(): Promise<void> {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
    });
  }

  /**
   * Index a single document (or chunk)
   */
  async addDocument(doc: RagDocument): Promise<void> {
    if (!this.collection) {
      throw new Error("RagEngine not initialized. Call init() first.");
    }

    const embedding = await this.embedder.embed(doc.content);

    await this.collection.add({
      ids: [doc.id],
      documents: [doc.content],
      embeddings: [embedding],
      metadatas: [doc.metadata ?? {}],
    });
  }

  /**
   * Query the knowledge base using semantic search
   */
  async query(
    text: string,
    options?: {
      topK?: number;
      threshold?: number;
    }
  ) {
    if (!this.collection) {
      throw new Error("RagEngine not initialized. Call init() first.");
    }

    const embedding = await this.embedder.embed(text);

    const topK = options?.topK ?? 3;
    const threshold = options?.threshold ?? DEFAULT_THRESHOLD;

    const results = await this.collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
      include: ["documents", "metadatas", "distances"],
    });

    const distances = results.distances?.[0] ?? [];

    // Chroma distances can be (number | null)[]
    const numericDistances = distances.filter(
      (d): d is number => typeof d === "number"
    );

    if (numericDistances.length === 0) {
      return FALLBACK_RESPONSE;
    }

    const minDistance = Math.min(...numericDistances);

    if (minDistance > threshold) {
      return {
        insufficientContext: true,
        answer: FALLBACK_RESPONSE.answer,
        sources: [],
        minDistance,
        threshold: DEFAULT_THRESHOLD,
      };
    }

    return {
      insufficientContext: false,
      documents: results.documents!,
      metadatas: results.metadatas!,
      distances: results.distances!,
    };
  }
}
