import { Router, Request, Response } from "express";
import {
  createPost,
  deletePost,
  getUserAllPosts,
} from "../controllers/post.controller";
import { requiredAuth } from "../middlewares/auth.middleware";

const postRouter = Router();

postRouter.get("/posts", requiredAuth, getUserAllPosts);
postRouter.post("/posts", requiredAuth, createPost);
postRouter.delete("/posts/:id/", requiredAuth, deletePost); // Get id from url path in controller.

export default postRouter;
