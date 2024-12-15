import express from "express";
import BrgRusakController from "../controller/BrgRusakControler.js";
import verifyUser from "../middleware/verifyUser.js";

const rusakRouter = express.Router();
const rusak = new BrgRusakController();

rusakRouter.post("/", verifyUser, rusak.createDataRusak);
rusakRouter.delete("/:id", verifyUser, rusak.deleteDataRusak);
rusakRouter.get("/:id", verifyUser, rusak.getDataRusakById);
rusakRouter.patch("/:id", verifyUser, rusak.updateDataRusak);
rusakRouter.get("/", verifyUser, rusak.getDataRusak);

export default rusakRouter;
