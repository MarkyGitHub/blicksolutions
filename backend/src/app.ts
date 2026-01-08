import cors from "cors";
import express from "express";
import { itemsRouter } from "./routes/items.js";

// Express App mit Middleware und Routes erstellen
export function createApp() {
  const app = express();

  const allowedOrigin = process.env.FRONTEND_ORIGIN;

  // CORS-Konfiguration
  app.use(
    cors({
      origin: allowedOrigin ? allowedOrigin : true
    })
  );

  app.use(express.json());

  // Health-Check Endpoint
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  // Items-Routes einbinden
  app.use("/items", itemsRouter);

  // 404 Handler für unbekannte Routes
  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
  });

  // Globaler Error Handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
