import OpenAI from "openai";
import { EmbeddingVector } from "../rag/rag.types";
import dotenv from "dotenv";

dotenv.config();

export class Embedder {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /** 
   * Genera un embedding a partir de un texto.
   */
  async embed(text: string): Promise<EmbeddingVector> {
    const response = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return response.data[0].embedding;
  }
}
