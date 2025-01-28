import {Request, Response, NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { prisma } from "../utils/prismaClient"

declare global {
    namespace Express {
        interface Request {
            email: string
        }
    }
}

export const authenticate = async(req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1]
    console.log("token in authenticate", req.headers)
    if(!token){
        res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
        const user = await prisma.user.findUnique({
            where:{
                email:decoded.email
            }
        })
        if(!user){
            res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }
       req.email = decoded.email
        next()
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
        
    }
}