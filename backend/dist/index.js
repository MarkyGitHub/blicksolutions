import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("Missing MONGO_URI in environment");
    process.exit(1);
}
const mongoUri = MONGO_URI;
async function main() {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    const app = createApp();
    app.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
    });
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
