import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

const generateAdCode = (businessId: string) => {
  const now = new Date();
  const shortTime = now.toISOString().slice(2, 16).replace(/[-T:]/g, "");
  return `AD-${businessId}-${shortTime}`;
};

export const CreateAd = async (req: Request, res: Response): Promise<any> => {
  try {
    const { businessId } = req.params;
    const { title, category, visibleFrom, visibleTo, imageUrl, stage, reset = false } = req.body;

    if (!title || !category || !visibleFrom || !visibleTo || !imageUrl || !stage)
      return res.status(400).json({ message: "Missing required fields" });

    const business = await prisma.business.findUnique({ where: { businessId } });
    if (!business) return res.status(404).json({ message: "Business not found" });

    const ad = await prisma.ads.create({
      data: {
        adCode: generateAdCode(businessId),
        title,
        category,
        visibleFrom: new Date(visibleFrom),
        visibleTo: new Date(visibleTo),
        imageUrl,
        stage,
        reset,
        businessId: business.businessId,
      },
    });

    res.status(201).json({ message: "Ad created", ad });
  } catch (error) {
    console.error("CreateAd error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetAds = async (req: Request, res: Response): Promise<any> => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    // Find business by businessId (BUS-1748949187121 format)
    const business = await prisma.business.findUnique({
      where: { businessId }
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const ads = await prisma.ads.findMany({
      where: {
        businessId: business.id // UUID from the DB
      }
    });

    res.status(200).json({ message: "Retrieved ads successfully", ads });

  } catch (error) {
    console.error("Error while getting ads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

