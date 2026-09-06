import { Router, Request, Response } from "express";


const healthRouter = Router()


healthRouter.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Health route is working.'
    })
})


export default healthRouter;