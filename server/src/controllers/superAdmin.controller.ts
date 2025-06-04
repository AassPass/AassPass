import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import { VerificationStatus, SubscriptionType, BusinessType } from '@prisma/client';
import { generatePassword } from "../utils/lib";
import { randomUUID } from 'crypto';



config();


const CreateAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userName, email, mobile } = req.body;

    if (!userName || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // You must get the SuperAdmin ID from somewhere — often added by middleware after auth
    const createdById = req.admin?.id; // Adjust based on your auth system
    if (!createdById) {
      return res.status(401).json({ message: 'Unauthorized: SuperAdmin ID missing' });
    }

    const adminId = `ADM-${randomUUID().slice(0, 6).toUpperCase()}`;
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        name: userName,
        email,
        role: 'ADMIN',
        adminId,
        password: hashedPassword,
        createdById,
      },
      select: {
        id: true,
        adminId: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin,
      credentials: {
        adminId,
        password,
      }
    });
  } catch (err: any) {
    console.error('CreateAdmin Error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const GetBusiness = async (req: Request, res: Response): Promise<any> => {
    try {
        const businesses = await prisma.business.findMany({
            include: {
                socialLinks: true,
            },
        });

        res.status(200).json(businesses);
    } catch (error) {
        console.error("Error fetching businesses:", error);
        res.status(500).json({ message: "Internal server error" });
    }    
}

const GetAdmins = async (req: Request, res: Response): Promise<any> => {
    try {
      const admins = await prisma.admin.findMany();
      res.status(200).json(admins);
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({message: "Internal server error"});
    }
}

const VerifyBusiness = async (req: Request, res: Response): Promise<any> => {
    try{
      const { businessId } = req.params;
      if(!businessId){
        return res.status(400).json({message: "Business ID is required"});
      }
      const business = await prisma.business.findUnique({
        where: {businessId}
      });
      if(!business){
        return res.status(404).json({message: "Business not found"});
      }
      if(business.verificationStatus === VerificationStatus.VERIFIED){
        return res.status(400).json({message: "Business is already verified"});
      }

      const updatedBusiness = await prisma.business.update({
        where: {businessId},
        data: {
          verificationStatus: VerificationStatus.VERIFIED,
        }
      });

      res.status(200).json({message: "Business verified successfully"});

    } catch (error){
        console.error("Error fetching business:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { CreateAdmin, GetBusiness, VerifyBusiness, GetAdmins };
