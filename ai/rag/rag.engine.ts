import { ChromaClient, Collection } from "chromadb";
import OpenAI from "openai";

export class RagEngine {
  private client: ChromaClient;
  private openai: OpenAI;

  public collection!: Collection;

  constructor(private collectionName: string) {
    this.client = new ChromaClient();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async init() {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
    });
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }

  async addDocument(doc: { id: string; content: string; metadata?: any }) {
    const embedding = await this.embedText(doc.content);

    await this.collection.add({
      ids: [doc.id],
      embeddings: [embedding],
      documents: [doc.content],
      metadatas: [doc.metadata ?? {}],
    });
  }

  async query(text: string) {
    const embedding = await this.embedText(text);

    return this.collection.query({
      queryEmbeddings: [embedding],
      nResults: 5,
    });
  }
}
