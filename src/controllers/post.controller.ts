import { Request, Response, NextFunction } from "express";
import { pool } from "../lib/db";
import {
  CreatePostSchema,
  UpdatePostSchema,
} from "../validations/post.validation";
import { DatabaseError } from "pg";
import { formatZodError } from "../utils/formatZodError";

type PostAccessCheck =
  | { authorized: true; post: { id: number; user_id: number } }
  | { authorized: false; reason: "not_found" | "forbidden" };

async function checkPostAccess(
  postId: string,
  session: { userId?: number; role?: string },
): Promise<PostAccessCheck> {
  const postResult = await pool.query(
    "SELECT id, user_id FROM posts WHERE id = $1",
    [postId],
  );

  if (postResult.rows.length === 0) {
    return { authorized: false, reason: "not_found" };
  }

  const post = postResult.rows[0];
  const isOwner = post.user_id === session.userId;
  const isAdmin = session.role === "admin";

  if (!isOwner && !isAdmin) {
    return { authorized: false, reason: "forbidden" };
  }

  return { authorized: true, post };
}

export async function getUserAllPosts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const isAdmin = req.session.role === "admin";

    const result = isAdmin
      ? await pool.query(
          `SELECT posts.id, posts.title, posts.content, posts.created_at, users.id AS author_id, users.name AS author_name FROM posts 
      INNER JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC`,
        )
      : await pool.query(
          `SELECT posts.id, posts.title, posts.content, posts.created_at, users.id AS author_id, users.name AS author_name FROM posts 
      INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = $1 ORDER BY posts.created_at DESC`,
          [req.session.userId],
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

    const { title, content } = parseResult.data;
    const userId = req.session.userId;

    const result = pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at",
      [userId, title, content ?? null],
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
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const access = await checkPostAccess(id, req.session);

    if (!access.authorized) {
      if (access.reason === "not_found") {
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }

      return res.status(403).json({
        success: false,
        error: "You can only delete your own posts",
      });
    }

    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING id, title",
      [id],
    );

    res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const parseResult = UpdatePostSchema.safeParse(req.body);

    if (!parseResult.success) {
      const fieldErrors = formatZodError(parseResult.error, req.body);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const access = await checkPostAccess(id, req.session);

    if (!access.authorized) {
      if (access.reason === "not_found") {
        return res
          .status(404)
          .json({ success: false, error: "Post not found" });
      }
      return res.status(403).json({
        success: false,
        error: "You can only update your own posts",
      });
    }

    const { title, content } = parseResult.data;

    const result = await pool.query(
      `UPDATE posts SET
         title = COALESCE($1, title),
         content = COALESCE($2, content)
       WHERE id = $3
       RETURNING id, user_id, title, content, created_at`,
      [title ?? null, content ?? null, id],
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}
