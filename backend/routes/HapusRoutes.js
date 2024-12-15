import express from "express";
import HapusController from "../controller/HapusController.js";
import verifyUser from "../middleware/verifyUser.js";

const hpsRouter = express.Router();
const hapus = new HapusController();

hpsRouter.post("/", verifyUser, hapus.createPenghapusan);
hpsRouter.delete("/:id", verifyUser, hapus.cancelPenghapusan);
hpsRouter.delete("/D/:id", verifyUser, hapus.deletePermanent);
hpsRouter.get("/:id", verifyUser, hapus.getPenghapusanById);
hpsRouter.patch("/:id", verifyUser, hapus.updatePenghapusan);
hpsRouter.get("/", verifyUser, hapus.getPenghapusan);

export default hpsRouter;
