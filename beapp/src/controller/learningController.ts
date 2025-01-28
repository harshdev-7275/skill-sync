import { Request, Response } from "express";
import { prisma } from "../utils/prismaClient";
import { generateCourseModulePrompt } from "../utils/prompts/utilsPrompts";
import { client } from "../utils/openAi";
import { Modules } from "@prisma/client";
const saveInitialLearning = async (req: Request, res: Response) => {
    try {
        const { programmingLanguages, level } = req.body;
        if (!programmingLanguages || !level) {
            res.status(400).json({
                success: false,
                message: "Please provide programming languages and level"
            })
            return;
        }
        const userExist = await prisma.user.findUnique({
            where: {
                email: req.email
            }
        })
        if (!userExist) {
            res.status(400).json({
                success: false,
                message: "User not found"
            })
            return;
        }
        const learningInitialize = await prisma.userStudyProfile.create({
            data: {
                programmingLanguages: programmingLanguages,
                level: level,
                userId: userExist.id
            }
        })
        res.status(200).json({
            success: true,
            message: "Learning initialized",
        })
    } catch (error) {
        console.log("error in save initial learning", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })

    }

}

const generateCourseModule = async (req: Request, res: Response) => {
    try {
        console.log("in generate course module");
        const { subjectName, level } = req.body;
        console.log("subjectName, level", subjectName, level);

        if (!subjectName || !level) {
             res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
            return
        }

        const prompt = generateCourseModulePrompt(subjectName, level);
        console.log("prompt", prompt);

        const chatBotResponse = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        });
        // console.log("chatBotResponse for generating course module", JSON.parse((chatBotResponse.choices[0].message.content) as string));

        const parsedData = JSON.parse((chatBotResponse.choices[0].message.content) as string);
        console.log("parsedData", parsedData.modules);
        const modulesData : Modules[] = parsedData.modules;

        for (const module of modulesData) {
            const newModule = await prisma.modules.create({
               data:{
                moduleName: module.moduleName,
                moduleDescription:module.moduleDescription,
                userStudyProgressId: req.email
               }
            });
            console.log("newModule", newModule);
        }

        // const newModules = await prisma.modules.create({
        //     data:{

        //     }
        // })
        // Send the response back to the client
        //  res.status(200).json({
        //     success: true,
        //     data: chatBotResponse.choices[0].message
        // });
        return
    } catch (error) {
        console.log("error in generate course module", error);
         res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { saveInitialLearning, generateCourseModule }

