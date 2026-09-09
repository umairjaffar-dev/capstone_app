import { Request, Response, NextFunction } from "express";
import { pool } from "../lib/db";
import { CreatePostSchema } from "../validations/post.validation";
import { DatabaseError } from "pg";
import { formatZodError } from "../utils/formatZodError";

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

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = CreatePostSchema.safeParse(req.body);
    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.body);
      const errorKeys = Object.keys(fieldErrors);
      if (errorKeys.length === 1) {
        return res
          .status(400)
          .json({ success: false, error: fieldErrors[errorKeys[0]] });
      }

      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const { title, user_id, content } = parseResult.data;

    const result = pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at",
      [user_id, title, content ?? null],
    );

    res.status(201).json({ success: true, data: (await result).rows[0] });
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "The specified user_id does not exist",
      });
    } else {
      return next(error);
    }
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING id, title",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Post deleted successfully!",
        data: result.rows[0],
      });
  } catch (err) {
    next(err);
  }
}
