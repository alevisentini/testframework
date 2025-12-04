import express from "express";
import { registerRagController } from "./ai/rag/rag.controller";

async function bootstrap() {
  const app = express();
  app.use(express.json());

  // Registrar rutas del RAG
  registerRagController(app);

  // Levantar servidor
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`RAG server running on http://localhost:${port}`);
  });
}

bootstrap();
