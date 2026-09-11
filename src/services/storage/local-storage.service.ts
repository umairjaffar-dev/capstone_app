import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { FileStorage, StoredFile } from "../../types/storage.types";
import { env } from "../../config/env";

const uploadDirectory = path.join(process.cwd(), "uploads", "user_images");

export class LocalStorage implements FileStorage {
  async save(file: Express.Multer.File): Promise<StoredFile> {
    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const fileExtName = path.extname(file.originalname);

    const fileName = `${crypto.randomUUID()}${fileExtName}`;

    const filePath = path.join(uploadDirectory, fileName);

    await fs.writeFile(filePath, file.buffer);

    const imageUrl = `${env.appUrl}uploads/user_images/${fileName}`;

    return {
      url: imageUrl,
      key: fileName,
    };
  }

  async saveMany(files: Express.Multer.File[]): Promise<StoredFile[]> {
    return Promise.all(files.map((file) => this.save(file)));
  }
}
