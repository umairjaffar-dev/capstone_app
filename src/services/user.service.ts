import { userRepository } from "../repositories/user.repository";
import { CreateUserSchemaType } from "../schemas/user.schema";
import {
  ProfilePictureUpdateResult,
  UserImageRow,
  UserRow,
} from "../types/user.types";

export const userService = {
  async createUser(input: CreateUserSchemaType): Promise<UserRow> {
    return userRepository.insertUser(input);
  },

  async getAllUsers(): Promise<Array<UserRow>> {
    return userRepository.findAllUsers();
  },

  async getUserById(id: number): Promise<UserRow | undefined> {
    return userRepository.findUserById(id);
  },

  async updateProfilePicture(
    id: number,
    imageUrl: string,
  ): Promise<ProfilePictureUpdateResult | undefined> {
    return userRepository.updateProfilePicture(id, imageUrl);
  },

  async addUserImages(
    id: number,
    imageUrls: string[],
  ): Promise<UserImageRow[]> {
    return userRepository.insertUserImages(id, imageUrls);
  },
};
