export type StoredFile = {
  url: string;
  key: string;
};

export interface FileStorage {
  save(file: Express.Multer.File): Promise<StoredFile>;

  saveMany(files: Express.Multer.File[]): Promise<StoredFile[]>;
}
