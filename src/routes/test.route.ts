import { Router, Request, Response } from "express";

const testRouter = Router();

testRouter.get("/test-error", (req: Request, res: Response) => {
  throw new Error("This is a deliberate test error!");
});

export default testRouter;
