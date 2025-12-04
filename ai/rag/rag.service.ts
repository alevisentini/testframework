import OpenAI from "openai";
import { ChromaClient, Collection } from "chromadb";

export class RagService {
  private openai: OpenAI;
  private chroma: ChromaClient;
  private collection!: Collection;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    this.chroma = new ChromaClient({
      path: "./db", // si usas server remoto → usa `url: "http://localhost:8000"`
    });
  }

  /**
   * Inicializa la colección de vectores.
   */
  public async init() {
    this.collection = await this.chroma.getOrCreateCollection({
      name: "documents",
      embeddingFunction: undefined, // usamos embeddings personalizados
    });
  }

  /**
   * Busca texto relevante mediante embeddings + similitud
   */
  private async getRelevantContext(query: string, nResults = 5) {
    const embed = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const results = await this.collection.query({
      queryEmbeddings: [embed.data[0].embedding],
      nResults,
    });

    const documents = results.documents?.flat() || [];

    return documents.join("\n---\n");
  }

  /**
   * Genera una respuesta RAG combinando contexto + modelo
   */
  public async ask(question: string): Promise<string> {
    if (!this.collection) {
      throw new Error("RAG Service not initialized. Run `init()` first.");
    }

    const context = await this.getRelevantContext(question);

    const prompt = `
You are a RAG assistant. Use ONLY the context provided.
If the answer is not in the context, say that the information is not available.

Context:
${context}

Question: ${question}
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    });

    return completion.choices[0].message.content || "";
  }
}
