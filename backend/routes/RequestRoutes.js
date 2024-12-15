import express from "express";
import RequestController from "../controller/RequestController.js";
import verifyUser from "../middleware/verifyUser.js";

const reqRouter = express.Router();
const reqBrg = new RequestController();

reqRouter.post("/", verifyUser, reqBrg.createReqBrg);
reqRouter.get("/", verifyUser, reqBrg.getRequestBarg);
reqRouter.get("/:id", verifyUser, reqBrg.getRequestBargById);
reqRouter.delete("/:id", verifyUser, reqBrg.deleteRequest);

export default reqRouter;
