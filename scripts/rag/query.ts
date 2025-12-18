import "dotenv/config";
import { RagEngine } from "../../ai/rag/rag.engine";
import { UvicornEmbedder } from "../../ai/embeddings/uvicorn.embedder";
import { QaAssistantService } from "../../ai/qa-assistant.service";

async function main() {
  const question = process.argv.slice(2).join(" ");
  if (!question) {
    console.error("Usage: query <text>");
    process.exit(1);
  }

  // 1) RAG engine with SAME embedder used at indexing time
  const rag = new RagEngine(
    "qa-knowledge-base",
    new UvicornEmbedder("http://127.0.0.1:8001")
  );

  await rag.init();

  // 2) Assistant (LLM disabled by design for now)
  const assistant = new QaAssistantService(rag);

  // 3) Ask
  const answer = await assistant.answer(question);

  console.log("\n--- ANSWER ---\n");
  console.log(answer);
}

main().catch(err => {
  console.error("❌ Query failed:", err);
  process.exit(1);
});
