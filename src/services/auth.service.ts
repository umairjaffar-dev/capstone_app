import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import {
  LoginUserSchemaType,
  RegisterUserSchemaType,
} from "../schemas/auth.schema";
import { UserRow } from "../types/user.types";

const SALT_ROUNDS = 10;

export const authService = {
  async register(input: RegisterUserSchemaType): Promise<UserRow> {
    const { password, confirmPassword, ...userData } = input;

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    return userRepository.insertRegisteredUser({
      ...userData,
      password_hash,
    });
  },

  async login(input: LoginUserSchemaType): Promise<UserRow | null> {
    const { email, password } = input;

    const user = await userRepository.findAuthUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return null;
    }

    const { password_hash, ...safeUser } = user;

    return safeUser;
  },
};
