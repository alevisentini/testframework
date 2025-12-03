import { ChromaClientWrapper } from "../../ai/vectordb/chroma.client";
import { Embedder } from "../../ai/embeddings/embedder";
import { RagEngine } from "../../ai/rag/rag.engine";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const embedder = new Embedder();
  const chroma = new ChromaClientWrapper("qa-knowledge-base");
  await chroma.init();

  const engine = new RagEngine("knowledge_base");
  await engine.init();

  // Ruta donde guardarás documentos de conocimiento
  const docsPath = path.join(__dirname, "../../knowledge");

  const files = fs.readdirSync(docsPath);
  for (const file of files) {
    const fullPath = path.join(docsPath, file);
    const content = fs.readFileSync(fullPath, "utf8");

    await engine.addDocument({
      id: file,
      content,
      metadata: { source: "knowledge-base" },
    });

    console.log(`📌 Indexed: ${file}`);
  }
}

main();
