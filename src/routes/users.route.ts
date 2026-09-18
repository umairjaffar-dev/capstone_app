import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  uploadUserImages,
  uploadUserProfilePicture,
} from "../controllers/user.controller";
import { upload } from "../middlewares/uploads";
import { requiredAuth } from "../middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.post("/user", createUser);
usersRouter.get("/users", requiredAuth, getAllUsers);
usersRouter.get("/user/:id", requiredAuth, getUserById);

usersRouter.post(
  "/user/:id/profile-picture",
  upload.single("profile-picture"),
  // requiredAuth,
  uploadUserProfilePicture,
);

usersRouter.post(
  "/user/:id/user-images",
  upload.array("user-images"),
  uploadUserImages,
);

export default usersRouter;
