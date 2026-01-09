import { ChromaClient, Collection } from "chromadb";
import { IEmbedder } from "../embeddings/embedder.interface";
import {
  RagDocument,
  RagFallbackResponse,
  RagQueryResult,
} from "./rag.types";

const DEFAULT_THRESHOLD = 1.2;

export const FALLBACK_RESPONSE: RagFallbackResponse = {
  insufficientContext: true,
  answer:
    "I don’t have enough relevant information in my QA knowledge base to answer this reliably.",
  sources: [],
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

  async init(): Promise<void> {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
    });
  }

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

  async query(
    text: string,
    options?: { topK?: number; threshold?: number }
  ): Promise<RagQueryResult> {
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

    const rawDistances = results.distances?.[0] ?? [];
    const numericDistances = rawDistances.filter(
      (d): d is number => typeof d === "number"
    );

    if (numericDistances.length === 0) {
      return FALLBACK_RESPONSE;
    }

    const minDistance = Math.min(...numericDistances);

    if (minDistance > threshold) {
      return {
        ...FALLBACK_RESPONSE,
        minDistance,
        threshold,
      };
    }

    // ✅ NORMALIZATION (the important part)
    const documents = (results.documents ?? []).map(row =>
      row.filter((d): d is string => typeof d === "string")
    );

    const metadatas = (results.metadatas ?? []).map(row =>
      row.filter(
        (m): m is Record<string, any> =>
          typeof m === "object" && m !== null
      )
    );

    const distances = (results.distances ?? []).map(row =>
      row.filter((d): d is number => typeof d === "number")
    );

    return {
      insufficientContext: false,
      documents,
      metadatas,
      distances,
    };
  }
}