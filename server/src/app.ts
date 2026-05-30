import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error.middleware";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL.split(",").map((s) => s.trim()),
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  if (env.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/", (_req, res) => {
    res.json({ name: "Pensil API", version: "0.1.0", docs: "/api/health" });
  });

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
