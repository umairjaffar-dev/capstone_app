import { Router, Request, Response } from "express";
import {
  createPost,
  deletePost,
  getUserAllPosts,
} from "../controllers/post.controller";

const postRouter = Router();

postRouter.get("/posts", getUserAllPosts);
postRouter.post("/posts", createPost);
postRouter.delete("/posts/:id/", deletePost); // Get id from url path in controller.

export default postRouter;
