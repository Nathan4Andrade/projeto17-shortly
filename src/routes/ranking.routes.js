import { Router } from "express"
import { openURL, ranking, URL} from "../controllers/ranking.controllers.js"

const rankingRouter = Router()

rankingRouter.get("/urls/:id", URL)

rankingRouter.get("/urls/open/:shortUrl", openURL)

rankingRouter.get("/ranking", ranking)

export default rankingRouter