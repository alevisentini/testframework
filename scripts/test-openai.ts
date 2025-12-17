import "dotenv/config";
import "./bootstrap-proxy";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  timeout: 60000,
});

async function main() {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: "proxy connectivity test",
  });

  console.log("✅ OpenAI reachable. Vector size:", res.data[0].embedding.length);
}

main().catch(console.error);
