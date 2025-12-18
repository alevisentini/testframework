import Anthropic from "@anthropic-ai/sdk";

export class ClaudeClient {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error("CLAUDE_API_KEY is not defined");
    }

    this.client = new Anthropic({ apiKey });
  }

  async ask(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      temperature: 0,
      max_tokens: 800,
      system:
        "You are a senior QA engineer specialized in Playwright. " +
        "Answer ONLY using the provided context. " +
        "If the context is insufficient, say explicitly that you do not have enough information.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.content[0]?.type === "text"
      ? response.content[0].text
      : "";
  }
}
