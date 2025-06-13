'use client';

import React from 'react';

const content = [
    { text: 'Shop A - 20% OFF!', img: '/shop-a.png' },
    { text: 'Shop B - New Arrivals!', img: '/shop-b.png' },
    { text: 'Shop C - Buy 1 Get 1 Free!', img: '/shop-c.png' },
    { text: 'Visit us now!', img: '/visit-us.png' },
];

const OfferBanner = () => {
    const repeatedContent = [...content, ...content]; // 2x for smooth loop

    return (
        <div className="relative overflow-hidden bg-yellow-100 py-3" aria-label="Promotional Offers Banner">
            <div className="banner-scroll flex items-center gap-6 px-4">
                {repeatedContent.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center min-w-[120px] text-center text-gray-800 text-sm font-medium"
                    >
                        <img
                            src={item.img}
                            alt={item.text}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-1 object-cover border"
                            loading="lazy"
                        />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .banner-scroll {
                    animation: scroll-banner 30s linear infinite;
                    width: max-content;
                }

                @keyframes scroll-banner {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
};

export default OfferBanner;
