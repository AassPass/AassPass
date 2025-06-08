import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { VerificationStatus, SubscriptionType, BusinessType } from '@prisma/client';



const RegisterBusiness = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      businessName,
      ownerName,
      phoneNumber,
      emailAddress,
      address,
      gstNumber,
      websiteLink,
      businessType,
      socialLinks,
      latitude,
      longitude
    } = req.body;

    // console.log('RegisterBusiness Request Body:', req.body);
    // Validate required fields
    if (!businessName || !ownerName || !phoneNumber || !emailAddress || !address || !gstNumber || !businessType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    // Generate a unique businessId
    const businessId = `BUS-${Date.now()}`;

    // Create the business
    const newBusiness = await prisma.business.create({
      data: {
        businessId,
        businessName,
        ownerName,
        phoneNumber,
        emailAddress,
        address,
        gstNumber,
        websiteLink,
        businessType: businessType as BusinessType,
        verificationStatus: VerificationStatus.PENDING,
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
    // console.log("asdfhaskdjfhaksdhfklashdfkhasdiof", businessId);
    console.log(req.body);
    const {
      businessName,
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

    if (businessName) updateData.businessName = businessName;
    if (ownerName) updateData.ownerName = ownerName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.emailAddress = email;
    if (address) updateData.address = address;
    if (gstNumber) updateData.gstNumber = gstNumber;
    if (websiteLink) updateData.websiteLink = websiteLink;
    if (businessType) updateData.businessType = businessType as BusinessType;
    if (subscriptionType) updateData.subscriptionType = subscriptionType.toUpperCase() as SubscriptionType;
    if (verificationStatus) updateData.verificationStatus = verificationStatus.toUpperCase() as VerificationStatus;
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

const GetAds = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      status,
      category,
      stage,
      limit = "10",
      page = "1",
    } = req.query;

    const filters: any = {};

    // Optional filter: verification status
    if (status && typeof status === "string") {
      filters.verificationStatus = status.toUpperCase(); // PENDING, VERIFIED, etc.
    }

    // Optional filter: ad category
    if (category && typeof category === "string") {
      filters.category = category.toUpperCase(); // FOOD, ELECTRONICS, etc.
    }

    // Optional filter: ad stage
    if (stage && typeof stage === "string") {
      filters.stage = stage.toUpperCase(); // CREATED, APPROVED, etc.
    }

    // Pagination values
    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [ads, totalCount] = await Promise.all([
      prisma.ads.findMany({
        where: filters,
        skip,
        take,
        include: {
          business: true, // Include related business data if needed
        },
      }),
      prisma.ads.count({
        where: filters,
      }),
    ]);

    return res.status(200).json({
      message: "Ads retrieved successfully",
      data: ads,
      pagination: {
        total: totalCount,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(totalCount / take),
      },
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const ChangeAdStatus = async (req: Request, res: Response): Promise<any> => {
  try{
    const { adId } = req.params;
    const { status } = req.body;
    if(!adId || !status){
      return res.status(400).json({message: "Ad Id and status are required"});
    }

    const allowedStatuses = ["PENDING", "VERIFIED", "REJECTED"];
    if (!allowedStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const ad = await prisma.ads.findUnique({
      where: {adId: adId}
    });

    if(!ad){
      return res.status(404).json({message: "Ad not found"});
    }

    const updatedAd = await prisma.ads.update({
      where: { adId: adId },
      data: {
        verificationStatus: status.toUpperCase(),
      },
    });

    return res.status(200).json({
      message: "Ad status updated successfully",
      data: updatedAd,
    });

  } catch(error){
    console.error("Error updating ad status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { RegisterBusiness, UpdateBusiness, GetAds, ChangeAdStatus };