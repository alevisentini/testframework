import "dotenv/config";
import { RagEngine } from "../../ai/rag/rag.engine";
import { MockEmbedder } from "../../ai/embeddings/mock.embedder";

async function main() {
  const engine = new RagEngine(
    "qa-knowledge-base",
    new MockEmbedder() // OpenAIEmbedder
  );

  await engine.init();

  const query = process.argv[2];
  if (!query) {
    console.error("Usage: query <text>");
    process.exit(1);
  }

  const results = await engine.query(query);
  console.log(JSON.stringify(results, null, 2));
}

main();
