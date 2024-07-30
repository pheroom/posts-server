import Router from 'express';
import postRouter from "./postRouter.js";
import userRouter from "./userRouter.js";
import authRouter from "./authRouter.js";

const router = Router();

router.use('/posts', postRouter)
router.use('/users', userRouter)
router.use('/auth', authRouter)

export default router