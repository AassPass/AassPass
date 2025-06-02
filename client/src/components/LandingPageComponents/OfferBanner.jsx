"use client";

import React from "react";

const content = [
    {
        text: "Shop A - 20% OFF!",
        img: "/shop-a.png",
    },
    {
        text: "Shop B - New Arrivals!",
        img: "/shop-b.png",
    },
    {
        text: "Shop C - Buy 1 Get 1 Free!",
        img: "/shop-c.png",
    },
    {
        text: "Visit us now!",
        img: "/visit-us.png",
    },
];

const OfferBanner = () => {
    return (
        <div className="overflow-hidden whitespace-nowrap bg-yellow-100 py-2">
            <div className="banner-scroll inline-flex items-center">
                {[...content, ...content, ...content].map((item, idx) => (
                    <div
                        key={idx}
                        className="inline-flex flex-col items-center px-4 text-base text-gray-800 font-medium"
                    >
                        <img
                            src={item.img}
                            alt={item.text}
                            className="w-24 h-24 rounded-full mb-1 object-cover border"
                        />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .banner-scroll {
          display: inline-flex;
          white-space: nowrap;
          animation: scroll-banner 25s linear infinite;
        }

        @keyframes scroll-banner {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    );
};

export default OfferBanner;
