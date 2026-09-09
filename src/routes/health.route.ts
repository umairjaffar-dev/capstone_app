import { Router, Request, Response } from "express";
import { pool } from "../lib/db";

const healthRouter = Router();

healthRouter.get("/health", async (req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "Server is running and database is connected.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Database connection failed." });
  }
});

export default healthRouter;
