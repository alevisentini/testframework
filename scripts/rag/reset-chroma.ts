import "dotenv/config";
import { ChromaClient } from "chromadb";

async function main() {
  const client = new ChromaClient();

  const collections = await client.listCollections();
  for (const col of collections) {
    if (col.name === "qa-knowledge-base") {
      console.log("🗑️ Deleting collection:", col.name);
      await client.deleteCollection({ name: col.name });
    }
  }

  console.log("✅ Chroma reset complete");
}

main();
