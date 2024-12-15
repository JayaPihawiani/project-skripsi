import express from "express";
import LokasiController from "../controller/LokasiController.js";
import verifyUser from "../middleware/verifyUser.js";

const locRouter = express.Router();
const loc = new LokasiController();

locRouter.post("/", verifyUser, loc.createLokasi);
locRouter.get("/", verifyUser, loc.getLokasi);
locRouter.get("/:id", verifyUser, loc.getLokasiById);
locRouter.patch("/:id", verifyUser, loc.updateLokasi);
locRouter.delete("/:id", verifyUser, loc.deleteLokasi);

export default locRouter;
