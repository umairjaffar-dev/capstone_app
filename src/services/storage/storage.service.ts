import { env } from "../../config/env";
import { CloudinaryStorage } from "./cloudinary-storage.service";
import { LocalStorage } from "./local-storage.service";
import { FileStorage } from "../../types/storage.types";
import { APP_STORAGE_DRIVER } from "../../constant/constant";

const storageDriver = env.storageDriver;

export const storage: FileStorage =
  storageDriver === APP_STORAGE_DRIVER.CLOUDINARY
    ? new CloudinaryStorage()
    : new LocalStorage();
