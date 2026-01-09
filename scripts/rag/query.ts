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

  const rag = new RagEngine(
    "qa-knowledge-base",
    new UvicornEmbedder("http://127.0.0.1:8001")
  );

  await rag.init();

  const assistant = new QaAssistantService(rag);
  const answer = await assistant.answer(question);

  console.log("\n--- ANSWER ---\n");
  console.log(answer);
}

main().catch(console.error);