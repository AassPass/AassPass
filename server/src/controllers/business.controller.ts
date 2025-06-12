import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

const generateAdCode = (businessId: string) => {
  const now = new Date();
  const shortTime = now.toISOString().slice(2, 16).replace(/[-T:]/g, "");
  return `AD-${businessId}-${shortTime}`;
};

export const CreateAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, category, visibleFrom, visibleTo, imageUrl, stage, reset = false } = req.body;
    const userId  = req.user?.id;
    // console.log(userId);

    const businessInfo = await prisma.user.findUnique({
      where: {id: userId},
      include: { businesses: true }
    });

    console.log("business :", businessInfo);

    const businessId = businessInfo?.businesses[0].id;
    
    if (!title || !category || !visibleFrom || !visibleTo || !imageUrl || !stage)
      return res.status(400).json({ message: "Missing required fields" });

    // const business = await prisma.business.findUnique({ where: { businessId } });
    // if (!business) return res.status(404).json({ message: "Business not found" });

    const ad = await prisma.ads.create({
      data: {
        adId: generateAdCode(businessId as string),
        title,
        category,
        visibleFrom: new Date(visibleFrom),
        visibleTo: new Date(visibleTo),
        imageUrl,
        stage,
        reset,
        businessId: businessId as string,
      },
    });

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

    const userId  = req.user?.id;

    const businessInfo = await prisma.user.findUnique({
      where: {id: userId},
      include: { businesses: true }
    });


    const businessId = businessInfo?.businesses[0].businessId;

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
    const userId  = req.user?.id;

    const businessInfo = await prisma.user.findUnique({
      where: {id: userId},
      include: { businesses: true }
    });

    const businessId = businessInfo?.businesses[0].id;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    // Find business by businessId (BUS-1748949187121 format)
    // const business = await prisma.business.findUnique({
    //   where: { businessId }
    // });

    // if (!business) {
    //   return res.status(404).json({ message: "Business not found" });
    // }

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

