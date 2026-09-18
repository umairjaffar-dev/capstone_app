import { UserRow } from "./user.types";

export interface RegisterUserData {
  name: string;
  email: string;
  age: number;
  is_active?: boolean;
  bio?: string;
  balance?: number;
  preferences?: Record<string, unknown>;
  password_hash: string;
}

export type AuthUserWithPassword = UserRow & { password_hash: string };
