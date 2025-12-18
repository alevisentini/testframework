import "dotenv/config";
import { RagEngine } from "../../ai/rag/rag.engine";
import { PromptBuilder } from "../../ai/rag/prompt.builder";
import { UvicornEmbedder } from "../../ai/embeddings/uvicorn.embedder";
import { ClaudeClient } from "../../ai/llm/claude.client";

async function main() {
  const question = process.argv.slice(2).join(" ");

  if (!question) {
    console.error("Usage: ask <question>");
    process.exit(1);
  }

  const rag = new RagEngine(
    "qa-knowledge-base",
    new UvicornEmbedder()
  );

  await rag.init();

  const result = await rag.query(question, { topK: 3 });

  // Fallback defensivo
  if ("answer" in result) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const rawDocuments = result.documents?.[0] ?? [];

  const documents = rawDocuments.filter(
    (doc): doc is string => typeof doc === "string"
  );

  const prompt = PromptBuilder.build({
    question,
    documents,
  });

  const claude = new ClaudeClient();
  const answer = await claude.ask(prompt);

  console.log("\n================ ANSWER ================\n");
  console.log(answer);
  console.log("\n=======================================\n");
}

main().catch(err => {
  console.error("❌ Ask failed:", err);
  process.exit(1);
});
