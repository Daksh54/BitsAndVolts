import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import postRoutes from "./routes/postRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");

export const createApp = () => {
  const app = express();
  const defaultOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://bitsandvoltsassignment.netlify.app"
  ];
  const configuredOrigins = (process.env.CLIENT_ORIGIN || "").split(",");
  const allowedOrigins = new Set(
    [...defaultOrigins, ...configuredOrigins]
      .map(normalizeOrigin)
      .filter(Boolean)
  );

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
          callback(null, true);
          return;
        }

        const error = new Error(`CORS blocked origin: ${origin}`);
        error.statusCode = 403;
        callback(error);
      }
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "bitsvolts-blog-api",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/posts", postRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
