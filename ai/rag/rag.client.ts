import axios from "axios";

export class RagClient {
  private baseUrl: string;

  // Constructor con URL base configurable
  constructor(baseUrl: string = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }

  /**
   * Hace una consulta al RAG y devuelve la respuesta
   * @param question La pregunta que se quiere hacer
   */
  async ask(question: string): Promise<string> {
    try {
      const res = await axios.post(`${this.baseUrl}/query`, { question });
      return res.data.answer;
    } catch (error: any) {
      console.error("Error al consultar RAG:", error.message);
      throw new Error("Error al consultar RAG");
    }
  }
}
