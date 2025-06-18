'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PopupContent = ({ business }) => {
  return (
    <div className="max-w-[240px]">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {/* Business Info Slide */}
          <CarouselItem>
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold">{business.businessName}</p>
                <p>{business.phoneNumber}</p>
                <p>{business.emailAddress}</p>
                <p>{business.websiteLink}</p>
                <p>{business.businessType}</p>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Ad Slides */}
          {business.ads?.map((ad, index) => (
            <CarouselItem key={ad.id || index}>
              <Card>
                <CardContent className="p-4">
                  <p className="font-semibold">{ad.title}</p>
                  <p>{ad.category}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </div>
  );
};

export default PopupContent;
