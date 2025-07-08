import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";


dotenv.config();

export const userAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(' ')[1];
    
    if(!token){
        res.status(401).json({message: "Access Denied. No token provided."});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

        (req as any).user = decoded;
        // console.log(decoded);

        next();
    } catch (error){
        res.status(400).json({message: "Invalid Token"});
        return;
    }
}