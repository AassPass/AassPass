import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";

config();

const jwtSecret = process.env.JWT_SECRET;

const AdminRegister = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Email, name, and password are required" });
        }

        // Check if the email already exists
        const existingAdmin = await prisma.superAdmin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            return res.status(409).json({ message: "SuperAdmin with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.superAdmin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "SUPER_ADMIN",
            }
        });

        res.status(201).json({
            message: "Super Admin registered successfully",
        });
    } catch (err) {
        console.error("Error during Super Admin registration:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const AdminLogin = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const admin = await prisma.superAdmin.findUnique({
            where: { email },
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
            message: "Super Admin logged in successfully",
            token: jwtToken
        });
    } catch (err) {
        console.error("Error during Super Admin login:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { AdminRegister, AdminLogin };
