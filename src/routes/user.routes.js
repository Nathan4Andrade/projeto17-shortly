import { Router } from "express";
import { login, register } from "../controllers/user.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaSignin, schemaSignup } from "../schemas/user.schemas.js";

const userRouter = Router();

userRouter.post("/signup", validateSchema(schemaSignup), register);

userRouter.post("/signin", validateSchema(schemaSignin), login);

export default userRouter;
