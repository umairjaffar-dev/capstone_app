import { Router } from "express";
import {
  createPost,
  deletePost,
  getUserAllPosts,
  updatePost,
} from "../controllers/post.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const postRouter = Router();

postRouter.get("/posts", requireAuth, getUserAllPosts);
postRouter.post("/posts", requireAuth, createPost);
postRouter.patch("/posts/:id", requireAuth, updatePost);
postRouter.delete("/posts/:id", requireAuth, deletePost); // Get id from url path in controller.

export default postRouter;
