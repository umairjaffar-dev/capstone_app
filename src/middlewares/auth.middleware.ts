import { Request, Response, NextFunction } from "express";

export function requiredAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  next()
}
