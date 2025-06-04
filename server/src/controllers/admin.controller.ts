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


export { RegisterBusiness, UpdateBusiness };