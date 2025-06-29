import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { Role, UserRole } from "@prisma/client";
import { randomUUID } from 'crypto';
import { sendResetPasswordEmail, sendVerificationEmail } from "../services/email.service";
import otpStorage from "../utils/otpStorage";
import { config } from "dotenv";


config();

const jwtSecret = process.env.JWT_SECRET as string;

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
            { admdinId: admin.adminId, id: admin.id, role: admin.role },
            jwtSecret,
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

const UserRegister = async (req: Request, res: Response): Promise<any> => {
    try{
        const { email, password, name } = req.body;

        if(!email || !password || !name) {
            return res.status(400).json({ message: "Email, password and name are required" });
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

        const verificationToken = jwt.sign(
            { id: user.id, email },
            jwtSecret,
            { expiresIn: "1d" }
        );

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "User registered successfully", userId: user.id});

    } catch (error) {
        console.error("Error during registering user:", error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

const UserLogin = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          businesses: {
            select: {
              businessId: true
            }
          }
        }
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!user.emailVerified) {
        return res.status(409).json({
          message: "Verify your email first. Check your Inbox or spam folder."
        });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const firstBusinessId = user.businesses[0]?.businessId ?? null;
  
      const jwtToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          businessId: firstBusinessId, // null if no business
        },
        jwtSecret as string,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({
        message: "User logged in successfully",
        token: jwtToken,
        role: user.role,
        businessId: firstBusinessId,
      });
  
    } catch (error) {
      console.error("Error during logging in user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
const VerifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.body;
    
        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }
    
        const decoded = jwt.verify(token, jwtSecret) as { id: string, email: string };
    
        if(!decoded){
            return res.status(400).json({ message: "Invalid verification token."});
        }

        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
        });

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        if(user.emailVerified) {
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

const handleSendOTP = async (req: Request, res: Response): Promise<any> => {
    try{
        const {email} = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await prisma.user.findUnique({
            where: {email}
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000});

        await sendResetPasswordEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch(error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

const handleRestPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: "All fields are required" });

        const storedOtp = otpStorage.get(email);
        if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const password = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password }
        })

        otpStorage.delete(email); // Remove OTP after successful password reset
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

// export { AdminRegister, AdminLogin, BusinessRegister, BusinessLogin, VerifyEmail };
export { AdminRegister, AdminLogin, VerifyEmail, UserRegister, UserLogin, handleSendOTP, handleRestPassword };
