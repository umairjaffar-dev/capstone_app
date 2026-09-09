import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  uploadUserProfilePicture,
} from "../controllers/user.controller";
import { upload } from "../middlewares/uploads";

const usersRouter = Router();

usersRouter.post("/user", createUser);
usersRouter.get("/users", getAllUsers);
usersRouter.get("/user/:id", getUserById);

usersRouter.post(
  "/user/:id/profile-picture",
  upload.single("profile-picture"),
  uploadUserProfilePicture,
);

export default usersRouter;
