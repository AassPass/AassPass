import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    id: string;
    role: string;
}

// Middleware factory to accept allowed roles
export function authorize(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.header("Authorization")?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: "Access Denied. No token provided." });
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
            
            // Attach decoded data to the request
            (req as any).admin = decoded;

            console.log(decoded.role);
            if (!allowedRoles.includes(decoded.role)) {
                res.status(403).json({ message: "Forbidden. You don't have permission to access this resource." });
                return;
            }

            next();
        } catch (err) {
            res.status(400).json({ message: "Invalid Token" });
            return;
        }
    };
}
