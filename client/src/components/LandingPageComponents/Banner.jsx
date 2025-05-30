"use client";

import React from "react";

const Banner = () => {
    const content = [
        "Shop A - 20% OFF!",
        "Shop B - New Arrivals!",
        "Shop C - Buy 1 Get 1 Free!",
        "Visit us now!",
    ];

    return (
        <div className="overflow-hidden whitespace-nowrap bg-yellow-100 py-0">
            <div className="banner-scroll inline-block">
                {[...content, ...content, ...content].map((item, idx) => (
                    <span key={idx} className="inline-block px-4 text-base text-gray-800 font-medium">
                        {item}
                    </span>
                ))}
            </div>

            <style jsx>{`
        .banner-scroll {
          display: inline-block;
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

export default Banner;
