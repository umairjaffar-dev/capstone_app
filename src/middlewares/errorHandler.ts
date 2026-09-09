import { Request, Response, NextFunction } from "express";
import { DatabaseError } from "pg";
import { logger } from "../lib/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({ err }, "Unhandled error");

  if (err instanceof DatabaseError && err.code === "23505") {
    const field = err.constraint?.split("_")[1] || "field";
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
      // details: {
      //   [field]: [`${field} already exists`],
      // },
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
}
