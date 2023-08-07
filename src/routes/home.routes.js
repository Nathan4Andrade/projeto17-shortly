import { Router } from "express";
import {
  deleteURL,
  shorten,
  openShortUrl,
  getUrlById,
} from "../controllers/home.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaUrl } from "../schemas/url.schemas.js";
import { validateAuth } from "../middlewares/validateAuth.middleware.js";

const homeRouter = Router();

homeRouter.post(
  "/urls/shorten",
  validateAuth,
  validateSchema(schemaUrl),
  shorten
);

homeRouter.get("/urls/:id", getUrlById);

homeRouter.delete("/urls/:id", validateAuth, deleteURL);

homeRouter.get("/urls/open/:shortUrl", openShortUrl);

export default homeRouter;
