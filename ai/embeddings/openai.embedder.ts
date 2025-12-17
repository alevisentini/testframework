import OpenAI from "openai";
import { IEmbedder, EmbeddingVector } from "./embedder.interface";

export class OpenAIEmbedder implements IEmbedder {
  private client: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined");
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async embed(text: string): Promise<EmbeddingVector> {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }
}
