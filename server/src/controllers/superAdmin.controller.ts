import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import { VerificationStatus, SubscriptionType, BusinessType } from '@prisma/client';
import { generatePassword } from "../utils/lib";
import { randomUUID } from 'crypto';
import { sendIDPasswordEmail } from "../services/email.service";



config();


const CreateAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
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
        name: name,
        email,
        role: 'ADMIN',
        adminId,
        mobile,
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

    await sendIDPasswordEmail(adminId, email, password);

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

const UpdateAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
      const { adminId } = req.params;
      const {name, email, isActive, mobile} = req.body;

      if(!adminId){
        return res.status(400).json({message: "Admin ID is required"});
      }

      const admin = await prisma.admin.findUnique({
        where: {adminId}
      });

      if(!admin){
        return res.status(404).json({message: "Admin not found"});
      }

      const updatedAdmin = await prisma.admin.update({
        where: {adminId},
        data: {
          name,
          email,
          isActive,
          mobile,
          updatedAt: new Date()
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

      res.status(200).json({message: "Admin updated successfully", admin: updatedAdmin});
    } catch (error) {
      console.error("Error updating admin:", error);
      return res.status(500).json({message: "Internal server error"});
    }
}

const GetBusinesses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { status, type, limit = "10", page = "1" } = req.query;

    // console.log("GetBusinesses called with params:", { status, type, limit, page });
    const filters: any = {};

    // Optional filter: verification status
    if (status && typeof status === 'string') {
      filters.verificationStatus = status.toUpperCase(); // PENDING, VERIFIED, etc.
    }

    // Optional filter: business type
    if (type && typeof type === 'string') {
      filters.businessType = type.toUpperCase(); // RESTAURANT, etc.
    }

    // Pagination values
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [businesses, totalCount] = await Promise.all([
      prisma.business.findMany({
        where: filters,
        skip,
        take,
        include: {
          socialLinks: true,
          registeredBy: {
            select: {
              adminId: true,
              name: true,
              email: true
            }
          }
        },
      }),
      prisma.business.count({
        where: filters
      })
    ]);

    return res.status(200).json({
      message: "Businesses retrieved successfully",
      data: businesses,
      pagination: {
        total: totalCount,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const GetAdmins = async (req: Request, res: Response): Promise<any> => {
    try {
      const {isActive, limit="10", page="1"} = req.query;
      const filters: any = {};
      
      if (isActive && typeof isActive === 'string') {
        filters.isActive = isActive.toLowerCase() === 'true';
      }
      filters.role = 'ADMIN';

      const take = parseInt(limit as string, 10);
      const skip = (parseInt(page as string, 10) - 1) * take;

      const [admins, totalCount] = await Promise.all([
        prisma.admin.findMany({
          where: filters,
          skip, 
          take,
          select: {
            id: true,
            adminId: true,
            email: true,
            name: true,
            mobile: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            createdById: true
          },
        }),
        prisma.admin.count({
          where: filters
        })
      ]);
      return res.status(200).json({
        message: "Admins retrived successfully",
        data: admins,
        pagination: {
          total: totalCount,
          page: parseInt(page as string, 10),
          limit: take,
          totalPage: Math.ceil(totalCount / take)
        }
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({message: "Internal server error"});
    }
}

const ChangeStatus = async (req: Request, res: Response): Promise<any> => {
    try{
      const { businessId } = req.params;
      const { status } = req.body;
      // console.log(businessId);
      if(!businessId || !status){
        return res.status(400).json({message: "Business ID and Status is required"});
      }
      const business = await prisma.business.findFirst({
        where: {businessId: businessId}
      });

      if(!business){
        return res.status(404).json({message: "Business not found"});
      }
      const allowedStatuses = Object.values(VerificationStatus);
      if (!allowedStatuses.includes(status.toUpperCase())){
        return res.status(400).json({message: "Invalid status provided"});
      } 
      if(business.verificationStatus === status.toUpperCase()){
        return res.status(400).json({message: "Business is already verified"});
      }

      const updatedBusiness = await prisma.business.update({
        where: { businessId: businessId },
        data: {
          verificationStatus: status.toUpperCase(),
        }
      });

      res.status(200).json({message: "Changed Status of business successfully"});

    } catch (error){
        console.error("Error fetching business:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const DeleteAdmin = async (req: Request, res: Response): Promise<any> => {
  try{
    const { adminId } = req.params;
  
    if(!adminId) {
      return res.status(400).json({ message: "Admin ID is required"});
    }
  
    const admin = await prisma.admin.findUnique({
      where: { adminId }
    });
  
    if(!admin){
      return res.status(404).json({ message: "Admin not found"});
    }
  
    try {
      await prisma.admin.delete({
        where: { adminId }
      });
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
      console.error("Error while deleting admin:", error);
      res.status(500).json({ message: "Failed to delete admin" });
    }

    res.status(200).json({ message: "Admin deleted successfully" });
    
  } catch(error) {
    console.error("Error while deleting admin", error);
    res.status(500).json({message: "Internal server error"});
  }
}

// const DeleteBusiness = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { businessId } = req.params;
//     if(!businessId) {
//       return res.status(400).json({ message: "Business ID is required" });
//     }

//     const business = await prisma.business
    
//   } catch(error) {
//     console.error("Error while deleting business", error);
//     res.status(500).json({message: "Internal server error"});
//   }

// }

export { CreateAdmin, GetBusinesses, ChangeStatus, GetAdmins, UpdateAdmin, DeleteAdmin };
