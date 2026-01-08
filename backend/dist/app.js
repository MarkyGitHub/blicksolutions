import cors from "cors";
import express from "express";
import { itemsRouter } from "./routes/items.js";
export function createApp() {
    const app = express();
    const allowedOrigin = process.env.FRONTEND_ORIGIN;
    app.use(cors({
        origin: allowedOrigin ? allowedOrigin : true
    }));
    app.use(express.json());
    app.get("/health", (_req, res) => {
        res.json({ ok: true });
    });
    app.use("/items", itemsRouter);
    app.use((req, res) => {
        res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err, _req, res, _next) => {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    });
    return app;
}
