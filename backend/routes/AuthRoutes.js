import express from "express";
import AuthController from "../controller/AuthController.js";

const authRouter = express.Router();
const auth = new AuthController();

authRouter.post("/login", auth.loginUser);
authRouter.delete("/logout", auth.logoutUser);
authRouter.get("/info", auth.userInfo);

export default authRouter;
