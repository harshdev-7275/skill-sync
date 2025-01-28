import express from "express";
import { saveInitialLearning,generateCourseModule } from "../controller/learningController";
import { authenticate } from "../middlewares/auth";


const router  = express.Router();

router.post("/save-initial-learning",authenticate,saveInitialLearning)

router.post("/generate-course-module", generateCourseModule)



export default router;