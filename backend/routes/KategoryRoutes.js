import express from "express";
import CategoryController from "../controller/KategoriController.js";
import verifyUser from "../middleware/verifyUser.js";

const kateRouter = express.Router();
const kategori = new CategoryController();

kateRouter.post("/", verifyUser, kategori.createCategory);
kateRouter.get("/", verifyUser, kategori.getCategory);
kateRouter.delete("/:id", verifyUser, kategori.deleteCategory);
kateRouter.patch("/:id", verifyUser, kategori.updateCategory);

export default kateRouter;
