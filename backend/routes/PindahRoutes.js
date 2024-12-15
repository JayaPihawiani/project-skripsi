import express from "express";
import PindahController from "../controller/PindahController.js";
import verifyUser from "../middleware/verifyUser.js";

const pindahRouter = express.Router();
const pindah = new PindahController();

pindahRouter.post("/", verifyUser, pindah.createPindah);
pindahRouter.get("/", verifyUser, pindah.getDataPindah);
pindahRouter.get("/:id", verifyUser, pindah.getDataPindahById);
pindahRouter.patch("/:id", verifyUser, pindah.updateDataPindah);
pindahRouter.delete("/:id", verifyUser, pindah.deleteDataPindah);

export default pindahRouter;
