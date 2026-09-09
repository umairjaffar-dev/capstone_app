import multer from "multer";

// This is a Multer middlware.

const storage = multer.memoryStorage(); // This memory storage doesn't store the file in disk, it load the file in memory as buffer
//  Also this allow us to directly 

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
