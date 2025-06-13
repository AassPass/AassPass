'use client';

import React from 'react';

const Banner = () => {
  const content = [
    'Shop A - 20% OFF!',
    'Shop B - New Arrivals!',
    'Shop C - Buy 1 Get 1 Free!',
    'Visit us now!',
  ];

  const repeated = [...content, ...content]; // for seamless loop

  return (
    <div
      className="relative overflow-hidden bg-yellow-100 py-2"
      role="marquee"
      aria-label="Latest offers and shop deals"
    >
      <div className="banner-scroll inline-flex">
        {repeated.map((text, idx) => (
          <span
            key={idx}
            className="px-4 text-sm md:text-base text-gray-800 font-medium whitespace-nowrap"
          >
            {text}
          </span>
        ))}
      </div>

      <style jsx>{`
                .banner-scroll {
                    animation: scroll-banner 30s linear infinite;
                    min-width: max-content;
                }

                @keyframes scroll-banner {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
    </div>
  );
};

export default Banner;
