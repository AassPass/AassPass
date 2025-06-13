import React from 'react'
import OfferBanner from './OfferBanner';

const HeroSection = () => {
    return (
        <div className='flex overflow-hidden flex-col gap-8 justify-center items-center text-center h-screen w-full'>
            <h2 className='text-3xl lg:text-5xl md:text-2xl'>AassPass - Discover What's <br /> Happening Around You!</h2>
            <p className='text-md md:text-lg lg:text-xl' >Find local offers,trending events,and explore your city like never before.</p>
            {/* Search Bar */}
            <div
                className={`transition-all duration-300  z-50 w-[75%] `}
            >
                <div className="relative">
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-lg">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search shops, locations..."
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base shadow-md"
                    />
                </div>
            </div>
            <OfferBanner />
        </div>
    )
}

export default HeroSection;