import { env } from "../../config/env";
import { CloudinaryStorage } from "./cloudinary-storage.service";
import { LocalStorage } from "./local-storage.service";
import { FileStorage } from "./storage.types";

const storageDriver = env.storageDriver;

export const storage: FileStorage =
  storageDriver === "cloudinary" ? new CloudinaryStorage() : new LocalStorage();
