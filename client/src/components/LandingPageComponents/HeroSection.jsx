'use client';
import React from 'react';
import Image from 'next/image';
import OfferBanner from './OfferBanner';
import colors from '@/libs/colors';
import { Search } from 'lucide-react';

const HeroSection = () => {
    return (
        <>
            <section className="relative w-full min-h-[calc(100vh-84px)] overflow-hidden flex items-center justify-center ">
                {/* Background Banner Image */}
                <Image
                    src="/banner.jpg"
                    alt="Background banner"
                    fill
                    className="object-cover object-center z-0"
                    priority
                />

                {/* Overlay Content */}
                <div className="relative z-10 max-w-7xl w-full h-full flex items-center px-6 lg:px-20">
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 justify-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                            <span style={{ color: colors.secondaryText }}>AassPass</span>{' '}
                            <span style={{ color: colors.primaryText }}>
                                – Discover What’s Happening Around You!
                            </span>
                        </h2>
                        <p className="text-base md:text-lg lg:text-xl" >
                            Find local offers, trending events, and explore your city like never before.
                        </p>

                        {/* Search Bar */}
                        <div className="w-full mt-2">
                            <div className="relative">
                                <span
                                    className="absolute inset-y-0 right-4 flex items-center text-xl"
                                    style={{ color: colors.primaryText }}
                                >
                                    <Search />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search shops, locations..."
                                    className="w-full pl-4 pr-12 py-3 rounded-sm focus:outline-none focus:ring-2 text-white placeholder-white"
                                    style={{

                                        border: `1px solid ${colors.searchBorder}`,
                                        color: colors.primaryText,
                                        boxShadow: `0 0 0 2px ${colors.searchRing}`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block lg:w-1/2" />
                </div>
            </section>

            <OfferBanner />
        </>
    );
};

export default HeroSection;
