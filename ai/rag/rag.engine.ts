import { ChromaClient, Collection } from "chromadb";
import { IEmbedder } from "../embeddings/embedder.interface";
import { RagDocument } from "./rag.types";

export class RagEngine {
  private client: ChromaClient;
  private collection!: Collection;

  constructor(
    private collectionName: string,
    private embedder: IEmbedder
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

  async query(text: string, topK = 5) {
    if (!this.collection) {
      throw new Error("RagEngine not initialized. Call init() first.");
    }

    const embedding = await this.embedder.embed(text);

    return this.collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });
  }
}
