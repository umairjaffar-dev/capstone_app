import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  registerUserController,
} from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/auth/register", registerUserController);
authRouter.post("/auth/login", loginUserController);
authRouter.post("/auth/logout", requireAuth, logoutUserController);

export default authRouter;
