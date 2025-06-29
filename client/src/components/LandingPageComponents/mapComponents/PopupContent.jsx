"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PopupContent = ({ business }) => {
  // console.log("business", business);
  return (
    <div className="w-full max-w-xs md:max-w-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {/* Business Info Slide */}
          <CarouselItem>
            <Card className="shadow-md hover:shadow-lg transition duration-300 rounded-xl border border-gray-200">
              <CardContent className="p-4 space-y-1">
                <p className="font-bold text-lg text-blue-700">
                  {business.businessName}
                </p>
                <p className="text-gray-700 text-sm">{business.phoneNumber}</p>
                <p className="text-gray-700 text-sm">{business.emailAddress}</p>
                {business.websiteLink && (
                  <a
                    href={business.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block"
                  >
                    {business.websiteLink}
                  </a>
                )}
                <p className="text-gray-600 text-sm italic">
                  {business.businessType}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Ad Slides */}
          {business.ads?.map((ad, index) => (
            <CarouselItem key={ad.id || index}>
              <Card className="shadow-md hover:shadow-lg transition duration-300 rounded-xl border border-gray-200">
                <CardContent className="p-4 space-y-2">
                  {ad.images?.[0]?.url && (
                    <img
                      src={ad.images[0].url}
                      alt="Ad Image"
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  )}
                  <p className="font-semibold text-blue-600 text-md">{ad.title}</p>
                  <p className="text-gray-600 text-sm">{ad.category}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Show navigation on hover or always visible */}
        {/* <CarouselPrevious className="hover:bg-gray-200" />
        <CarouselNext className="hover:bg-gray-200" /> */}
      </Carousel>
    </div>
  );
};

export default PopupContent;
