import { pool } from "../lib/db";
import { logger } from "../lib/logger";
import {
  NewUserData,
  ProfilePictureUpdateResult,
  UserImageRow,
  UserRow,
} from "../types/user.types";

export const userRepository = {
  async insertUser(data: NewUserData): Promise<UserRow> {
    const { name, email, age, is_active, bio, balance, preferences } = data;
    const result = await pool.query(
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

    return result.rows[0];
  },

  async findAllUsers(): Promise<Array<UserRow>> {
    const result = await pool.query(
      "SELECT id, name, email, age, balance, bio, preferences, is_active, profile_picture_url, created_at from users ORDER BY id",
    );
    return result.rows;
  },

  async findUserById(id: number): Promise<UserRow | undefined> {
    const result = await pool.query(
      "SELECT id, name, email, age, balance, bio, preferences, is_active, profile_picture_url, created_at from users WHERE id=$1",
      [id],
    );

    return result.rows[0];
  },

  async updateProfilePicture(
    id: number,
    imageUrl: string,
  ): Promise<ProfilePictureUpdateResult | undefined> {
    const result = await pool.query(
      "UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING id, name, email, profile_picture_url",
      [imageUrl, id],
    );
    return result.rows[0];
  },

  async insertUserImages(
    userId: number,
    imagesUrls: Array<string>,
  ): Promise<UserImageRow[]> {
    const valuePlaceholders: string[] = [];
    const params: (number | string)[] = [];

    imagesUrls.forEach((url, index) => {
      const base = index * 2;
      valuePlaceholders.push(`($${base + 1}, $${base + 2})`);
      params.push(userId, url);
    });

    const result = await pool.query<UserImageRow>(
      `INSERT INTO user_images (user_id, image_url)
         VALUES ${valuePlaceholders.join(", ")}
         RETURNING id, user_id, image_url, created_at`,
      params,
    );

    return result.rows;
  },
};
