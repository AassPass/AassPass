import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { uploadImage } from "../services/imageStore";
import fs from "fs";
import path from "path";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);


const generateAdCode = (businessId: string) => {
  const now = new Date();
  const shortTime = now.toISOString().slice(2, 16).replace(/[-T:]/g, "");
  return `AD-${businessId}-${shortTime}`;
};

export const CreateAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, category, visibleFrom, visibleTo, stage, reset = false } = req.body;
    const businessId = req.user?.businessId;
    const files = req.files as Express.Multer.File[];

    // console.log(req.user);
    if (!title || !category || !visibleFrom || !visibleTo || !stage)
      return res.status(400).json({ message: "Missing required fields" });

    if (!files || files.length === 0)
      return res.status(400).json({ message: "At least one image is required" });

    const business = await prisma.business.findUnique({
      where: { businessId },
      include: { ads: true },
    });

    if (!business) return res.status(404).json({ message: "Business not found" });

    // 2. Check ad limit based on subscription type
    const currentAdCount = business.ads.length;
    const subscription = business.subscriptionType;

    let adLimit = 0;
    if (subscription === "STANDARD") adLimit = 2;
    else if (subscription === "PREMIUM") adLimit = 5;

    if (currentAdCount >= adLimit)
      return res.status(403).json({ message: `Ad limit reached (${adLimit} ads allowed for ${subscription} plan)` });

    // Create the ad
    const ad = await prisma.ads.create({
      data: {
        adId: generateAdCode(businessId as string),
        title,
        category,
        visibleFrom: new Date(visibleFrom),
        visibleTo: new Date(visibleTo),
        stage,
        reset,
        businessId: business.id,
      },
    });

    // Upload each image to Cloudinary and save to DB
    const imageEntries = [];

    for (const file of files) {
      const tempPath = path.join(__dirname, "../../tmp", file.originalname);
      fs.writeFileSync(tempPath, file.buffer);

      const imageUrl = await uploadImage(tempPath); // uploads to Cloudinary
      imageEntries.push({ url: imageUrl, adId: ad.id });

      await unlinkAsync(tempPath); // delete temp file
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

