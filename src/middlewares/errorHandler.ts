import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
