import { Express } from "express";
import { RagService } from "./rag.service";

export function registerRagController(app: Express) {
  const rag = new RagService();
  rag.init();

  app.post("/query", async (req, res) => {
    try {
      const answer = await rag.ask(req.body.question);
      res.json({ answer });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
