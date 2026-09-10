import { cloudinary } from "../../config/cloudinary";
import { FileStorage, StoredFile } from "./storage.types";

export class CloudinaryStorage implements FileStorage {
  async save(file: Express.Multer.File): Promise<StoredFile> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary returned no result"));
          }

          resolve({
            url: result.secure_url,
            key: result.public_id,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async saveMany(files: Express.Multer.File[]): Promise<StoredFile[]> {
    return Promise.all(files.map((file) => this.save(file)));
  }
}
