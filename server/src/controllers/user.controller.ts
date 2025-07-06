import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { VerificationStatus, SubscriptionType, BusinessType, UserRole } from '@prisma/client';
import { businessTypeMap } from "../utils/lib";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { uploadImage } from "../services/imageStore";
import fs from "fs";
import path from "path";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);


config();

const jwtSecret = process.env.JWT_SECRET;

export const GetAds = async (req: Request, res: Response): Promise<any> => {
  try {
    // Get `n` from query params, fallback to 5 if not provided
    const n = parseInt(req.query.n as string) || 5;

    // Step 1: Count total ads
    const totalAds = await prisma.ads.count({
      where: {
        verificationStatus: VerificationStatus.VERIFIED, // optional filter
        visibleFrom: { lte: new Date() },
        visibleTo: { gte: new Date() }
      }
    });

    if (totalAds === 0) {
      return res.status(200).json({ ads: [] });
    }

    // Step 2: Generate random skip values (limit to totalAds - n)
    const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, totalAds - n)));

    // Step 3: Get n random ads with business and images
    const ads = await prisma.ads.findMany({
      where: {
        verificationStatus: VerificationStatus.VERIFIED,
        visibleFrom: { lte: new Date() },
        visibleTo: { gte: new Date() }
      },
      skip,
      take: n,
      include: {
        business: true,
        images: true
      }
    });

    console.log(ads);
    res.status(200).json({ ads });
  } catch (error) {
    console.error("Error fetching random ads:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const GetUserInfo = async (req: Request, res: Response): Promise<any> => {
  try{
    const id = req.user?.id;
    // console.log(id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        emailVerified: true,
        role: true,
        businesses: {
          include: {
            socialLinks: true,
            ads: {
              include: {
                images: true
              }
            }
          }
        }
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

    console.log(businesses);
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
    // console.log(req);

    if(!user) {
      return res.status(400).json({message: "You do not have the access token is missing"});
    }

    if (!businessName || !phoneNumber || !emailAddress || !address || !businessType || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const owner = await prisma.user.findUnique({
      where: {id: user?.id}
    });

    if(!owner){
      return res.status(404).json({message: "No user found. Token is probably wrong. Please again log in"});
    }

    const businessId = `BUS-${Date.now()}`;
    const prismaBusinessType = businessTypeMap[businessType as keyof typeof businessTypeMap] || undefined;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let profilePictureUrl: string | undefined;
    let bannerPictureUrl: string | undefined;

    const saveAndUpload = async (file: Express.Multer.File): Promise<string> => {
      const tempPath = path.join(__dirname, "../../tmp", file.originalname);
      fs.writeFileSync(tempPath, file.buffer);
      const imageUrl = await uploadImage(tempPath); // assumes this works with file path
      await unlinkAsync(tempPath);
      return imageUrl;
    };

    if (files["profilePicture"]?.[0]) {
      profilePictureUrl = await saveAndUpload(files["profilePicture"][0]);
    }

    if (files["bannerPicture"]?.[0]) {
      bannerPictureUrl = await saveAndUpload(files["bannerPicture"][0]);
    }

    const [newBusiness, updatedUser] = await prisma.$transaction([

      prisma.business.create({
        data: {
          businessId,
          businessName,
          profilePicture: profilePictureUrl || null,
          bannerPicture: bannerPictureUrl || null,
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
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.OWNER,
        }
      }),
    ]);


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