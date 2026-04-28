import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(dirname, "../.env") });

const port = process.env.PORT || 5000;
const app = createApp();

const startServer = async () => {
  await connectDatabase(process.env.MONGO_URI);

  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start API server", error);
  process.exit(1);
});
