'use client';

import React from 'react';
import Image from 'next/image';

const content = [
    { text: 'Shop A - 20% OFF!', img: '/shop-a.png' },
    { text: 'Shop B - New Arrivals!', img: '/shop-b.png' },
    { text: 'Shop C - Buy 1 Get 1 Free!', img: '/shop-c.png' },
    { text: 'Visit us now!', img: '/visit-us.png' },
];

const OfferBanner = () => {
    return (
        <div className="relative w-full overflow-hidden bg-yellow-100 py-4" aria-label="Promotional Offers Banner">
            <div className="marquee flex gap-8 w-max animate-scroll hover:[animation-play-state:paused] px-4">
                {[...content, ...content].map((item, idx) => (
                    <div
                        key={idx}
                        className="flex-shrink-0 flex flex-col items-center w-[110px] sm:w-[130px] text-center text-gray-800 text-sm sm:text-base font-medium"
                    >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-gray-300 mb-2">
                            <Image
                                src={item.img}
                                alt={item.text}
                                fill
                                className="object-cover"
                                loading="lazy"
                            />
                        </div>
                        <span className="truncate w-full">{item.text}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default OfferBanner;
