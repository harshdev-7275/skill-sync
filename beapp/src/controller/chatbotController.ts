import { Request, Response } from "express";

import { prisma } from "../utils/prismaClient";
import { learningFormSubmit, learningInitialze, learningModuleGenerated } from "../utils/chatbotUtils";

export const chatResponse =  async(req:Request, res:Response)=>{
    console.log("in chat response")

    try {
        const message = req.body.message;
        const isFormSubmit  = req.body.isFormSubmit;
        const isModuleGenerated  = req.body.isModuleGenerated;
        // console.log("message", message)
        console.log("isModuleGenerated ", isModuleGenerated)

        const userExist = await prisma.user.findUnique({
            where: {
                email: req.email
            }
        })
        // console.log("userExist", userExist)
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
        console.log("existingCourse", isFormSubmit)
        if(isModuleGenerated === true){
            console.log("isModuleGenerated inside if", isModuleGenerated)
            
            learningModuleGenerated(userExist.username as string, message, res as Response)
            return;
        }
        if(!existingCourse ||  existingCourse.programmingLanguages === null){
            learningInitialze( userExist.username as string, message, res as Response)
            return;
        }
        if(isFormSubmit !== null || isFormSubmit === true){
            learningFormSubmit(userExist.username as string, message, res as Response)
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