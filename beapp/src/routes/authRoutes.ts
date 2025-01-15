import express, { Request, Response } from "express";
import {signIn, loginUser, getUser, checkUserName, updateProfile} from "../controller/authController"

const router = express.Router();

// POST /sign-in route
router.post("/sign-in", signIn)

router.post("/login", loginUser)


router.get("/get-user", getUser)

router.post("/check-username", checkUserName)

router.patch("/update-profile", updateProfile)

export default router;
