import { Request, Response } from "express";

import { prisma } from "../utils/prismaClient";
import { learningInitialze } from "../utils/chatbotUtils";

export const chatResponse =  async(req:Request, res:Response)=>{
    console.log("in chat response")

    try {
        const message = req.body.message;
        console.log("message", message)

        const userExist = await prisma.user.findUnique({
            where: {
                email: req.email
            }
        })
        console.log("userExist", userExist)
        if (!userExist) {
            res.status(400).json({
                success: false,
                message: "User not found"
            })
            return
        }

        const existingCourse = await prisma.userStudyProfile.findUnique({
            where:{
                userId:userExist.id
            }
        });
        console.log("existingCourse", existingCourse)
        if(!existingCourse ||  existingCourse.programmingLanguages === null){
            learningInitialze( userExist.username as string, message, res as Response)
            return;
        }

        

    } catch (error) {
        console.log("error in chatResponse", error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }


}