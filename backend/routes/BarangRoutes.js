import express from "express";
import BarangController from "../controller/BarangController.js";
import verifyUser from "../middleware/verifyUser.js";

const brgRouter = express.Router();
const brg = new BarangController();

brgRouter.get("/", verifyUser, brg.getBarang);
brgRouter.get("/:id", verifyUser, brg.getBarangById);
brgRouter.patch("/:id", verifyUser, brg.updateBarang);
brgRouter.patch("/K/:id", verifyUser, brg.updateKondisiEstimasiBrg);
brgRouter.delete("/:id", verifyUser, brg.deleteBarang);
brgRouter.post("/", verifyUser, brg.createBarang);

export default brgRouter;
