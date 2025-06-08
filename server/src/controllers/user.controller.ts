import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const GetBusinesses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusInMeters = parseFloat(radius as string) * 1000;

    const businesses = await prisma.$queryRaw`
    SELECT *
    FROM "Business"
    WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL AND
        ST_DWithin(
        geography(ST_MakePoint("longitude"::double precision, "latitude"::double precision)),
        geography(ST_MakePoint(${longitude}::double precision, ${latitude}::double precision)),
        ${radiusInMeters}
        )
    `;

    res.status(200).json({
      message: "Nearby businesses retrieved successfully",
      data: businesses,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};