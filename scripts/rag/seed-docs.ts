import fs from "fs";
import path from "path";
import { RagEngine } from "../../ai/rag/rag.engine";
import { chunkDocument } from "../../ai/rag/chunker";
import { UvicornEmbedder } from "../../ai/embeddings/uvicorn.embedder";

const KNOWLEDGE_DIR = path.resolve("knowledge");

async function main() {
  const engine = new RagEngine(
    "qa-knowledge-base",
    new UvicornEmbedder("http://127.0.0.1:8001")
  );

  await engine.init();

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter(f => f.endsWith(".md"));

  for (const file of files) {
    const fullPath = path.join(KNOWLEDGE_DIR, file);
    const content = fs.readFileSync(fullPath, "utf-8");

    const chunks = chunkDocument(file, content);

    for (const chunk of chunks) {
      await engine.addDocument({
        id: chunk.id,
        content: chunk.content,
        metadata: {
          source: "knowledge",
          file,
          chunkIndex: chunk.index,
        },
      });
    }

    console.log(`📌 Indexed ${file} (${chunks.length} chunks)`);
  }
}

main().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
