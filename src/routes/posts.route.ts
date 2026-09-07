import { Router, Request, Response } from "express";
import { getUserAllPosts } from "../controllers/post.controller";

const postRouter = Router();

postRouter.get("/posts", getUserAllPosts);

export default postRouter;