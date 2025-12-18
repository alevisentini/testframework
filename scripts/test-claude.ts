import "dotenv/config";
import "./bootstrap-proxy";
import Anthropic from "@anthropic-ai/sdk";

async function main() {
  if (!process.env.CLAUDE_API_KEY) {
    throw new Error("CLAUDE_API_KEY is not defined");
  }

  const client = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  const res = await client.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: "Say hello as a senior QA engineer",
      },
    ],
  });

  console.log(res.content[0]);
}

main().catch((err) => {
  console.error("Claude test failed:", err);
});
