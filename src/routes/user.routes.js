import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { schemaSignin, schemaSignup } from "../schemas/user.schemas.js";
import { signin, signup, getMe } from "../controllers/users.controllers.js";
import { validateAuth } from "../middlewares/validateAuth.middleware.js";

const userRouter = Router();

userRouter.post("/signup", validateSchema(schemaSignup), signup);

userRouter.post("/signin", validateSchema(schemaSignin), signin);

userRouter.get("/users/me", validateAuth, getMe);

export default userRouter;
