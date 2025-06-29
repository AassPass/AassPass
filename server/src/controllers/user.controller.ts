import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { VerificationStatus, SubscriptionType, BusinessType, Role, UserRole } from '@prisma/client';
import { businessTypeMap, generatePassword } from "../utils/lib";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";


config();

const jwtSecret = process.env.JWT_SECRET;


export const GetUserInfo = async (req: Request, res: Response): Promise<any> => {
  try{
    const id = req.user?.id;
    // console.log(id);

    const user = await prisma.user.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        emailVerified: true,
        role: true
      }
    });

    if(!user){
      return res.status(404).json({message: "No user found"});
    }

    res.status(200).json({message: "User retrieved successfully", user});

  } catch(error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
}


export const GetBusinesses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusInMeters = parseFloat(radius as string) * 1000;

    // Step 1: Get nearby business IDs using raw SQL
    const nearbyBusinessIds: { id: string }[] = await prisma.$queryRaw`
      SELECT "id"
      FROM "Business"
      WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL AND
            ST_DWithin(
              geography(ST_MakePoint("longitude", "latitude")),
              geography(ST_MakePoint(CAST(${longitude} AS double precision), CAST(${latitude} AS double precision))),
              ${radiusInMeters}
            )
    `;

    const ids = nearbyBusinessIds.map((b) => b.id);
    if (ids.length === 0) {
      return res.status(200).json({ message: "No businesses found nearby", data: [] });
    }

    // Step 2: Fetch businesses and up to 3 ads per business
    const businesses = await prisma.business.findMany({
      where: { id: { in: ids } },
      include: {
        ads: {
          orderBy: { visibleFrom: 'desc' },
          take: 3,
          include: {
            images: true,
          },
        },
      },
    });


    res.status(200).json({
      message: "Nearby businesses retrieved successfully",
      data: businesses,
    });

  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const CreateBusiness = async (req: Request, res: Response): Promise<any> => {
  try{
    const {
      businessName,
      phoneNumber,
      emailAddress,
      address,
      gstNumber,
      businessType,
      websiteLink,
      socialLinks,
      latitude,
      longitude
    } = req.body;

    const user = req.user;

    if(!user) {
      return res.status(400).json({message: "You do not have the access token is missing"});
    }

    // console.log('RegisterBusiness Request Body:', req.body);
    // Validate required fields
    if (!businessName || !phoneNumber || !emailAddress || !address || !gstNumber || !businessType || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const owner = await prisma.user.findUnique({
      where: {id: user?.id}
    });

    if(!owner){
      return res.status(404).json({message: "No user found. Token is probably wrong. Please again log in"});
    }

    // Generate a unique businessId
    const businessId = `BUS-${Date.now()}`;
    const prismaBusinessType = businessTypeMap[businessType as keyof typeof businessTypeMap] || undefined;


    // Create the business
    const newBusiness = await prisma.business.create({
      data: {
        businessId,
        businessName,
        ownerName: owner.name,
        ownerId: user.id,
        phoneNumber,
        emailAddress,
        address,
        gstNumber,
        websiteLink,
        businessType: prismaBusinessType as BusinessType,
        verificationStatus: VerificationStatus.PENDING,
        subscriptionType: SubscriptionType.STANDARD,
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

    const token = jwt.sign(
        { id: user.id, role: UserRole.OWNER, businessId: newBusiness.businessId },
        jwtSecret as string,
        { expiresIn: "7d" }
    );

    return res.status(201).json({ message: 'Business created successfully', business: newBusiness, token });
    
  } catch (error) {
    console.error("Error while creating businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}