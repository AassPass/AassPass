'use client';

import React from 'react';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const content = [
  { text: '20% OFF!', img: '/businessIcon/kfc.svg' },
  { text: 'New Arrivals!', img: '/businessIcon/burger-king.svg' },
  { text: 'Buy 1 Get 1 Free!', img: '/businessIcon/taco-bell.svg' },
  { text: 'Visit us now!', img: '/businessIcon/popeyes.svg' },
  { text: 'Buy 1 Get 1 Free!', img: '/businessIcon/taco-bell.svg' },
  { text: 'New Arrivals!', img: '/businessIcon/burger-king.svg' },
  { text: 'Visit us now!', img: '/businessIcon/popeyes.svg' },
  { text: 'Buy 1 Get 1 Free!', img: '/businessIcon/taco-bell.svg' },
];

const OfferBanner = () => {
  return (
    <div className="relative w-full overflow-hidden bg-yellow-100 py-4" aria-label="Promotional Offers Banner">
      <Marquee gradient={false} speed={50} pauseOnHover={true} className="px-4">
        {content.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-md mx-4 min-w-fit"
          >
            <Image
              src={item.img}
              alt={item.text}
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm font-semibold text-gray-800">{item.text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default OfferBanner;
