import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import cors from "cors";
import appRouter from "./routes";
import { logger } from "./lib/logger";

// Main express app configuration file for middleware and routes mounting:
export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", appRouter);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "Server is running..." });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

// Now we want to handle global error handling, if any error occure in our project
//  it autometically catch here.
