import "dotenv/config";
import { RagEngine } from "../../ai/rag/rag.engine";
import { UvicornEmbedder } from "../../ai/embeddings/uvicorn.embedder";

async function main() {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.error("Usage: query <text>");
    process.exit(1);
  }

  const engine = new RagEngine(
    "qa-knowledge-base",
    new UvicornEmbedder("http://127.0.0.1:8001")
  );

  await engine.init();

  // ✅ pasar nResults como number, no como objeto
  const results = await engine.query(query, 3);

  console.log(JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
