import express from "express";
import UserController from "../controller/UserController.js";
import verifyUser from "../middleware/verifyUser.js";

const userRouter = express.Router();
const user = new UserController();

userRouter.post("/", user.createUser);
userRouter.get("/", verifyUser, user.getUser);
userRouter.delete("/:id", verifyUser, user.deleteUser);
userRouter.patch("/:id", verifyUser, user.updateUser);
userRouter.get("/:id", verifyUser, user.getUserById);

export default userRouter;
