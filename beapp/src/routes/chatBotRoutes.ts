import express from "express";
import { chatResponse } from "../controller/chatbotController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/respond", authenticate,chatResponse)



export default router;