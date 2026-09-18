import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  uploadUserImages,
  uploadUserProfilePicture,
} from "../controllers/user.controller";
import { upload } from "../middlewares/uploads";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.get("/users", requireAuth, requireRole("admin"), getAllUsers);
usersRouter.get("/user/:id", requireAuth, getUserById);

usersRouter.post(
  "/user/:id/profile-picture",
  requireAuth,
  upload.single("profile-picture"),
  uploadUserProfilePicture,
);

usersRouter.post(
  "/user/:id/user-images",
  requireAuth,
  upload.array("user-images"),
  uploadUserImages,
);


export default usersRouter;
