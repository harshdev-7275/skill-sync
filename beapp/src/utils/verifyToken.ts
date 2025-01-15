import jwt from "jsonwebtoken"
export const verifyToken = (token:string)=>{
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        return payload;
    } catch (error) {
        return null;
    }
}