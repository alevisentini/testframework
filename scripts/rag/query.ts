import "dotenv/config";
import { RagEngine } from "../../ai/rag/rag.engine";

async function main() {
  const engine = new RagEngine("qa-knowledge-base");
  await engine.init();

  const query = process.argv[2];

  if (!query) {
    console.error("❌ Debes ingresar una consulta. Ejemplo:");
    console.error('   npx ts-node scripts/rag/query.ts "como testear una API"');
    process.exit(1);
  }

  console.log(`🔎 Buscando documentos relevantes para: "${query}" ...\n`);

  const results = await engine.query(query);

  if (!results || results.ids.length === 0) {
    console.log("⚠️ No se encontraron documentos relevantes.");
    return;
  }

  const ids = results.ids[0];
  const docs = results.documents![0];
  const scores = results.distances![0];

  console.log("📚 Resultados:\n");

  ids.forEach((id, i) => {
    console.log(`------------------------------`);
    console.log(`📄 ID: ${id}`);
    console.log(`📘 Documento:\n${docs[i]}`);
    console.log(`⭐ Score: ${scores[i]}`);
  });

  console.log(`\n✔ Consulta finalizada.`);
}

main();
