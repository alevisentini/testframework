interface PromptBuilderInput {
  question: string;
  documents: string[];
}

export class PromptBuilder {
  static build(input: PromptBuilderInput): string {
    const { question, documents } = input;

    const context = documents
      .map((doc, i) => `SOURCE ${i + 1}:\n${doc}`)
      .join("\n\n---\n\n");

    return `
You are a Senior QA Engineer specialized in Playwright and modern test automation.

You must answer the user's question using ONLY the information provided in the CONTEXT section below.

STRICT RULES:
- Do NOT use external knowledge.
- Do NOT make assumptions.
- If the context is insufficient, explicitly say so.
- Do NOT mention sources explicitly unless relevant.
- Be precise, pragmatic, and professional.

CONTEXT:
${context}

QUESTION:
${question}

ANSWER:
`.trim();
  }
}
