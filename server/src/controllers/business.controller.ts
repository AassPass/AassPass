import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { uploadImage } from "../services/imageStore";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { adCategoryMap } from "../utils/lib";
import { AdCategory } from "@prisma/client";
const unlinkAsync = promisify(fs.unlink);


const generateAdCode = (businessId: string) => {
  const now = new Date();
  const shortTime = now.toISOString().slice(2, 16).replace(/[-T:]/g, "");
  return `AD-${businessId}-${shortTime}`;
};


export const CreateAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, category, visibleFrom, visibleTo, stage, reset = false, ...rest } = req.body;
    const businessId = req.user?.businessId;
    const files = req.files as Express.Multer.File[];

    if (!title || !category || !visibleFrom || !visibleTo || !stage)
      return res.status(400).json({ message: "Missing required fields" });

    if (!files || files.length === 0)
      return res.status(400).json({ message: "At least one image is required" });

    const business = await prisma.business.findUnique({
      where: { businessId },
      include: { ads: true },
    });

    if (!business)
      return res.status(404).json({ message: "Business not found" });

    const currentAdCount = business.ads.length;
    const subscription = business.subscriptionType;

    let adLimit = 0;
    if (subscription === "STANDARD") adLimit = 2;
    else if (subscription === "PREMIUM") adLimit = 5;

    if (currentAdCount >= adLimit)
      return res.status(403).json({ message: `Ad limit reached (${adLimit} ads allowed for ${subscription} plan)` });

    const mappedCategory = adCategoryMap[category as keyof typeof adCategoryMap];


    // Determine category-specific metadata
    let metadata: Record<string, any> = {};

    switch (category) {
      case 'Deals & Discounts':
        metadata = {
          discountPercentage: rest.discountPercentage,
          validTill: rest.validTill,
          terms: rest.terms,
        };
        break;
      case 'Events':
        metadata = {
          location: rest.location,
          time: rest.time,
          rsvp: rest.rsvp,
        };
        break;
      case 'Services':
        metadata = {
          serviceType: rest.serviceType,
          contact: rest.contact,
          radius: rest.radius,
        };
        break;
      case 'Products for Sale':
        metadata = {
          price: rest.price,
          deliveryOption: rest.deliveryOption,
          condition: rest.condition, // e.g. new/used
        };
        break;
      case 'Job Openings':
        metadata = {
          salary: rest.salary,
          hours: rest.hours,
          location: rest.location,
          qualifications: rest.qualifications,
        };
        break;
      case 'Rentals & Properties':
        metadata = {
          area: rest.area,
          rent: rest.rent,
          amenities: rest.amenities,
          contact: rest.contact,
          availableFrom: rest.availableFrom,
        };
        break;
      case 'Announcements':
        metadata = {
          announcementType: rest.announcementType,
          content: rest.content,
          importanceLevel: rest.importanceLevel, // e.g. high/medium/low
        };
        break;
      case 'Contests & Giveaways':
        metadata = {
          rules: rest.rules,
          endDate: rest.endDate,
          eligibility: rest.eligibility,
          prize: rest.prize,
        };
        break;
      default:
        metadata = {};
    }


    // Create ad with metadata
    const ad = await prisma.ads.create({
      data: {
        adId: generateAdCode(businessId as string),
        title,
        category: mappedCategory as AdCategory,
        visibleFrom: new Date(visibleFrom),
        visibleTo: new Date(visibleTo),
        stage,
        reset,
        businessId: business.id,
        metadata,
      },
    });

    // Upload images
    const imageEntries = [];

    for (const file of files) {
      const tempPath = path.join(__dirname, "../../tmp", file.originalname);
      fs.writeFileSync(tempPath, file.buffer);

      const imageUrl = await uploadImage(tempPath); // uploads to Cloudinary
      imageEntries.push({ url: imageUrl, adId: ad.id });

      await unlinkAsync(tempPath);
    }

    await prisma.adImage.createMany({ data: imageEntries });

    res.status(201).json({ message: "Ad created", ad });
  } catch (error) {
    console.error("CreateAd error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const UpdateAd = async (req: Request, res: Response): Promise<any> => {
  try{
    const {adId} = req.params;
    const {title, category, visibleFrom, visibleTo, imageUrl, stage, reset} = req.body;
    if (!adId || !title || !category || !visibleFrom || !visibleTo || !imageUrl || !stage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ad = await prisma.ads.findUnique({where: {id: adId}});
    if(!ad){
      return res.status(404).json({message: "Ad not found"});
    }

    const businessId  = req.user?.businessId

    if(ad.businessId !== businessId) {
      return res.status(403).json({ message: "You do not have permission to update this ad"});
    }

    const updateData: any = {};

    if(title) updateData.title = title;
    if(category) updateData.category = category;
    if(visibleFrom) updateData.visibleFrom = new Date(visibleFrom);
    if(visibleTo) updateData.visibleTo = new Date(visibleTo);
    if(imageUrl) updateData.imageUrl = imageUrl;
    if(stage) updateData.stage = stage;
    if(reset !== undefined) updateData.reset = reset; 


    const updatedAd = await prisma.ads.update({
      where: {id: adId},
      data: updateData,
    });

    res.status(200).json({message: "Ad updated successfully", ad: updatedAd});
  } catch (error){
    console.error("UpdateAd error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const GetAds = async (req: Request, res: Response): Promise<any> => {
  try {
    const businessId  = req.user?.businessId

    // Find business by businessId (BUS-1748949187121 format)
    const business = await prisma.business.findUnique({
      where: { businessId }
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const ads = await prisma.ads.findMany({
      where: {
        businessId // UUID from the DB
      }
    });

    res.status(200).json({ message: "Retrieved ads successfully", ads });
  } catch (error) {
    console.error("Error while getting ads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const DeleteAd = async (req: Request, res: Response): Promise<any> => {
  try{
    const id = req.params.id;
    const businessId = req.user?.businessId;

    const ad = await prisma.ads.findUnique({
      where: {id},
      include: {
        business: true,
      }
    });

    if(ad?.business.id !== businessId){
      return res.status(403).json({ message: "You do not have permission to delete this ad" });
    }

    await prisma.ads.delete({
      where: { id }
    });

    res.status(200).json({ message: "Ad deleted successfully"});
  }
  catch (error){
    console.error("Error while deleting ad:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

