import { Router } from "express";
import homeRouter from "./home.routes.js";
import rankingRouter from "./ranking.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use(homeRouter);
router.use(rankingRouter);
router.use(userRouter);

export default router;
