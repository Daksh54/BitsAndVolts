import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

export const createApp = () => {
  const app = express();
  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://bitsandvoltsassignment.netlify.app"
  ];
  const allowedOrigins = (process.env.CLIENT_ORIGIN || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "bitsvolts-blog-api",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/posts", postRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
