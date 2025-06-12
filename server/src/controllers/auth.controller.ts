import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { Role, UserRole, VerificationStatus } from "@prisma/client";
import { randomUUID } from 'crypto';


config();

const jwtSecret = process.env.JWT_SECRET;

const AdminRegister = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, name, mobile } = req.body;

        if (!email || !password || !name || !mobile) {
            return res.status(400).json({ message: "Email, name, and password are required" });
        }

        // Check if the email already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            return res.status(409).json({ message: "SuperAdmin with this email already exists" });
        }

        const adminId = `ADM-${randomUUID().slice(0, 6).toUpperCase()}`;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                email,
                adminId,
                password: hashedPassword,
                name,
                role: Role.SUPER_ADMIN,
                mobile,
            }
        });

        res.status(201).json({
            message: "Super Admin registered successfully",
            adminId
        });
    } catch (err) {
        console.error("Error during Super Admin registration:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const AdminLogin = async (req: Request, res: Response): Promise<any> => {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
        return res.status(400).json({ message: "adminId and password are required" });
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { adminId },
        });

        if (!admin) {
            return res.status(404).json({ message: "Super Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const jwtToken = jwt.sign(
            { id: admin.id, role: admin.role },
            jwtSecret as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Admin logged in successfully",
            token: jwtToken,
            role: admin.role
        });
    } catch (err) {
        console.error("Error during Super Admin login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// const BusinessRegister = async (req: Request, res: Response): Promise<any> => {
//     try{
//         const { email, password, name = "juned" } = req.body;

//         if(!email || !password || !name) {
//             return res.status(400).json({message: "Email, name and password are required"});
//         }

//         const existingBusiness = await prisma.business.findUnique({
//             where: { emailAddress: email },
//         });

//         if(existingBusiness) {
//             return res.status(409).json({message: "Business with this email already exists"});
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const businessId = `BUS-${Date.now()}`;

//         const newBusiness = await prisma.business.create({
//             data: {
//                 emailAddress: email,
//                 businessName: name,
//                 businessId,
//                 verificationStatus: VerificationStatus.PENDING,
//                 joinedDate: new Date()
//             }
//         });

//         res.status(201).json({
//             message: "Business registered successfully",
//         });


//     } catch (error){
//         console.error("Error during Business Register:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// const BusinessLogin = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const {email, password} = req.body;

//         if(!email || !password) {
//             return res.status(404).json({message: "Email and password are required"});
//         }

//         const business = await prisma.business.findUnique({
//             where: {emailAddress: email}
//         })

//         if(!business){
//             return res.status(404).json({message: "Business not found"});
//         }

//         const isPasswordValid = await bcrypt.compare(password, business.password != null? business.password: "");

//         if(!isPasswordValid) {
//             return res.status(401).json({message: "Invalid password"});
//         }

//         const jwtToken = jwt.sign(
//             {id: business.id, role: "BUSINESS", businessId: business.businessId}, 
//             jwtSecret as string,
//             {expiresIn: "1d"}
//         )

//         res.status(200).json({message: "Business logged in successfully", token: jwtToken, role: "BUSINESS", businessId: business.businessId});

//     } catch(error) {
//         console.error("Error during Business login:", error);
//         res.status(500).json({message: "Internal server error"});
//     }
// }



const VerifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.body;
    
        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }
    
        const decoded = jwt.verify(token, jwtSecret as string) as { id: string, email: string };
    
        if(!decoded){
            return res.status(400).json({ message: "Invalid verification token."});
        }

        const user = await prisma.user.findUnique({
            where: {email: decoded.email},
        });

        if(user?.emailVerified) {
            return res.status(400).json({ message: "Email is already verified."});
        }

        const updatedUser = await prisma.user.update({
            where: {email: decoded.email},
            data: {
                emailVerified: true,
            }
        });

        res.status(200).json({ message: "Email verified successfully"});

    } catch (error) {
        console.error("Error during email verification:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

const UserRegister = async (req: Request, res: Response): Promise<any> => {
    try{
        const { email, password, name } = req.body;

        if(!email || !password || !name) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if(existingUser) {
            return res.status(409).json({ message: "User with this email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create( {
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER
            }
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id});

    } catch (error) {
        console.error("Error during registering user:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

const UserLogin = async (req: Request, res: Response): Promise<any> => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            res.status(400).json({ message: "Email and password are required"});
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const jwtToken = jwt.sign(
            { id: user.id, role: user.role },
            jwtSecret as string,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Admin logged in successfully",
            token: jwtToken,
            role: user.role
        });

    } catch (error) {
        console.error("Error during logging in user:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

// export { AdminRegister, AdminLogin, BusinessRegister, BusinessLogin, VerifyEmail };
export { AdminRegister, AdminLogin, VerifyEmail, UserRegister, UserLogin };
