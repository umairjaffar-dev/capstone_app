import { Request, Response, NextFunction } from "express";
import { pool } from "../lib/db";
import { CreateUserSchema } from "../validations/user.validation";
import z from "zod";
import { storage } from "../services/storage/storage.service";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parseResult = CreateUserSchema.safeParse(req.body);

    if (!parseResult.success) {
      //   const formattedErrors = parseResult.error.issues.map((issue) => ({
      //     field: issue.path.join(".") || "root",
      //     message: issue.message,
      //   }));

      const { fieldErrors } = z.flattenError(parseResult.error);
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: fieldErrors,
      });
    }

    const { name, email, age, is_active, bio, balance, preferences } =
      parseResult.data;

    const user = await pool.query(
      `INSERT INTO users (name, email, age, is_active, bio, balance, preferences) 
      VALUES ($1, $2, $3, COALESCE($4, false), $5, COALESCE($6, 0), $7) 
      RETURNING id, name, email, age, is_active, bio, balance, preferences, created_at`,
      [
        name,
        email,
        age,
        is_active,
        bio ?? null,
        balance,
        preferences ? JSON.stringify(preferences) : null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await pool.query(
      "SELECT id, name, email, age, balance, bio, preferences, is_active, profile_picture_url, created_at from users ORDER BY id",
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users.rows,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.params;
  try {
    const users = await pool.query(
      "SELECT id, name, email, age, balance, bio, preferences, is_active, created_at from users WHERE id=$1",
      [id],
    );

    if (users.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadUserProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No image file provided." });
    }
    // We upload buffer to cloudinary through stream.
    const storedFile = await storage.save(req.file);

    const imageUrl = storedFile.url;
    const dbResult = await pool.query(
      "UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING id, name, email, profile_picture_url",
      [imageUrl, id],
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, data: dbResult.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function uploadUserImages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No image files provided" });
    }

    const userResult = await pool.query(
      `
        SELECT id
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const storedFiles = await storage.saveMany(files);

    for (const file of storedFiles) {
      await pool.query(
        ` INSERT INTO user_images (user_id, image_url)
      VALUES ($1, $2)`,
        [id, file.url],
      );
    }

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: {
        userId: id,
        data: {
          userId: id,
          images: storedFiles.map((file) => file.url),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
