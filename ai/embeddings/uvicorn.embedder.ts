import axios from "axios";
import { IEmbedder } from "./embedder.interface";

export class UvicornEmbedder implements IEmbedder {
  constructor(
    private readonly baseUrl = "http://127.0.0.1:8001"
  ) {}

  async embed(text: string): Promise<number[]> {
    const response = await axios.post(`${this.baseUrl}/embed`, {
      text,
    });

    if (!response.data?.embedding) {
      throw new Error("Invalid embedding response from Uvicorn service");
    }

    return response.data.embedding;
  }
}
