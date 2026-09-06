

// This is entry file for all routes, this will combine all our routes.

import { Router } from "express";
import healthRouter from "./health.route";

const appRouter = Router()

appRouter.use(healthRouter)


export default appRouter