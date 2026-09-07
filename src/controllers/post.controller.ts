import { Request, Response, NextFunction } from "express";
import { pool } from "../lib/db";

export async function getUserAllPosts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await pool.query(
      `SELECT posts.id, posts.title, posts.content, posts.created_at, users.id AS author_id, users.name AS author_name FROM posts 
      INNER JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC`,
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}
