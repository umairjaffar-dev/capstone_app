// This is entry file for all routes, this will combine all our routes.

import { Router } from "express";
import healthRouter from "./health.route";
import testRouter from "./test.route";
import usersRouter from "./users.route";
import postRouter from "./posts.route";

const appRouter = Router();

appRouter.use(healthRouter);
appRouter.use(testRouter);
appRouter.use(usersRouter);
appRouter.use(postRouter);

export default appRouter;
