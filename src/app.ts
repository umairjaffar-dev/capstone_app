import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import cors from "cors";
import appRouter from "./routes";
import path from "node:path";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./lib/db";
import { env } from "./config/env";
import aiRouter from "./routes/ai.route";

// Main express app configuration file for middleware and routes mounting:
export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.set("trust proxy", 1);
  app.use(
    session({
      store: new (pgSession(session))({
        pool: pool,
        tableName: "session",
      }),
      secret: env.sessionSecret,
      resave: false, // Donn't save session after every request if nothing has been changed.
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Cookie cann't access through client side javascript.
        secure: env.isProduction, // cookies served on https in production.
        maxAge: 24 * 60 * 60 * 1000,
      },
    }),
  );

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  app.use("/api", appRouter);
  // app.get("/", (req: Request, res: Response) => {
  //   res.status(200).json({ success: true, message: "Server is running..." });
  // });
  app.use("/", aiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
