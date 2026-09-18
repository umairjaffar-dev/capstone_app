// This is the response getting from postgresql query.
export interface UserRow {
  id: number;
  name: string;
  email: string;
  age: number;
  is_active: boolean;
  bio: string | null;
  balance: string; // pg driver numeric(10,2) returns string by default.
  preferences: Record<string, unknown> | null;
  profile_picture_url: string | null;
  role: string;
  created_at: Date;
}

// Upload user profile image/picture return schema:
export type ProfilePictureUpdateResult = Pick<
  UserRow,
  "id" | "name" | "email" | "profile_picture_url"
>;

export interface UserImageRow {
  id: number;
  user_id: number;
  image_url: string;
  created_at: Date;
}
