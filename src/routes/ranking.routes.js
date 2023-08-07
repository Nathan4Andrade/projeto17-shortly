import { Router } from "express";
import { ranking } from "../controllers/ranking.controllers.js";

const rankingRouter = Router();

rankingRouter.get("/ranking", ranking);

export default rankingRouter;
