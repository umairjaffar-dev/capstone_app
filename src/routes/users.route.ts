import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller";

const usersRouter = Router();

usersRouter.post("/user", createUser);
usersRouter.get("/users", getAllUsers);
usersRouter.get("/user/:id", getUserById);

export default usersRouter;
