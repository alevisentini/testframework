import { ChromaClient, Collection } from "chromadb";

export class ChromaClientWrapper {
  private client: ChromaClient;
  private collection!: Collection;

  constructor(private collectionName: string) {
    this.client = new ChromaClient();
  }

  async init() {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
    });
  }

  async addDocument(id: string, text: string, embedding: number[]) {
    await this.collection.add({
      ids: [id],
      documents: [text],
      embeddings: [embedding],
    });
  }

  async query(embedding: number[], topK = 3) {
    return this.collection.query({
      queryEmbeddings: [embedding],
      nResults: topK,
    });
  }
}
