import { config } from "dotenv";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma";
import jwt from "jsonwebtoken";
import { VerificationStatus, SubscriptionType, BusinessType } from '@prisma/client';
import { generatePassword } from "../utils/lib";
import { randomUUID } from 'crypto';



config();

const jwtSecret = process.env.JWT_SECRET;

const SuperAdminRegister = async (req: Request, res: Response): Promise<any> => {
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

const SuperAdminLogin = async (req: Request, res: Response): Promise<any> => {
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

const RegisterBusiness = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      ownerName,
      phoneNumber,
      email,
      address,
      gstNumber,
      websiteLink,
      businessType,
      socialLinks,
      latitude,
      longitude
    } = req.body;

    console.log('RegisterBusiness Request Body:', req.body);
    // Validate required fields
    if (!name || !ownerName || !phoneNumber || !email || !address || !gstNumber || !businessType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    // Generate a unique businessId
    const businessId = `BUS-${Date.now()}`;

    // Create the business
    const newBusiness = await prisma.business.create({
      data: {
        businessId,
        businessName: name,
        ownerName,
        phoneNumber,
        emailAddress: email,
        address,
        gstNumber,
        websiteLink,
        businessType: businessType as BusinessType,
        verificationStatus: VerificationStatus.HOLD,
        subscriptionType: SubscriptionType.FREE,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        socialLinks: {
          create: socialLinks?.map((link: { platform: string; link: string }) => ({
            platform: link.platform,
            link: link.link
          })) || [],
        },
      },
      include: {
        socialLinks: true
      }
    });

    return res.status(201).json({ message: 'Business registered successfully', business: newBusiness });
  } catch (error: any) {
    console.error('RegisterBusiness Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
 
const UpdateBusiness = async (req: Request, res: Response): Promise<any> => {
  try {
    const { businessId } = req.params;
    const {
      name,
      ownerName,
      phoneNumber,
      email,
      address,
      gstNumber,
      websiteLink,
      businessType,
      subscriptionType,
      verificationStatus,
      latitude,
      longitude,
      socialLinks
    } = req.body;

    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required' });
    }

    // Prepare update data
    const updateData: any = {};

    if (name) updateData.businessName = name;
    if (ownerName) updateData.ownerName = ownerName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.emailAddress = email;
    if (address) updateData.address = address;
    if (gstNumber) updateData.gstNumber = gstNumber;
    if (websiteLink) updateData.websiteLink = websiteLink;
    if (businessType) updateData.businessType = businessType as BusinessType;
    if (subscriptionType) updateData.subscriptionType = subscriptionType as SubscriptionType;
    if (verificationStatus) updateData.verificationStatus = verificationStatus as VerificationStatus;
    if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
    if (longitude !== undefined) updateData.longitude = parseFloat(longitude);

    const updatedBusiness = await prisma.business.update({
      where: { businessId },
      data: {
        ...updateData,
        ...(socialLinks && {
          socialLinks: {
            deleteMany: {}, // remove old links
            create: socialLinks.map((link: { platform: string; link: string }) => ({
              platform: link.platform,
              link: link.link
            }))
          }
        })
      },
      include: {
        socialLinks: true
      }
    });

    return res.status(200).json({ message: 'Business updated successfully', business: updatedBusiness });
  } catch (error: any) {
    console.error('UpdateBusiness Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const CreateAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
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
        name,
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

export { SuperAdminRegister, SuperAdminLogin, RegisterBusiness, UpdateBusiness, CreateAdmin, GetBusiness };
