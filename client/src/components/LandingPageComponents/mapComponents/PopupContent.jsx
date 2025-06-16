'use client';

import React, { useState } from 'react';

const PopupContent = ({ business }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 1 + (business.ads?.length || 0); // 1 for business + N ads

  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  const renderBusinessSlide = () => (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-800 truncate">{business.businessName}</h3>
      <p className="text-xs text-gray-600 line-clamp-2">{business.address}</p>
      <div className="text-[10px] text-gray-400">
        Location: {business.latitude?.toFixed(2)}, {business.longitude?.toFixed(2)}
      </div>
      {business.websiteLink && (
        <a
          href={business.websiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-blue-600 underline hover:text-blue-800"
        >
          Visit Website
        </a>
      )}
      <button className="w-full text-xs font-medium bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition">
        Contact Business
      </button>
    </div>
  );

  const renderAdSlide = (ad) => (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-gray-800 truncate">{ad.title}</h3>
      <p className="text-xs text-gray-600">Category: {ad.category}</p>
      <p className="text-[10px] text-gray-500">
        From {new Date(ad.visibleFrom).toLocaleDateString()} to{' '}
        {new Date(ad.visibleTo).toLocaleDateString()}
      </p>
      <p className="text-[10px] text-gray-400">Stage: {ad.stage}</p>
      <button className="w-full text-xs font-medium bg-green-600 text-white py-1 rounded hover:bg-green-700 transition">
        View Offer
      </button>
    </div>
  );

  // Determine current slide
  const content =
    currentSlide === 0
      ? renderBusinessSlide()
      : renderAdSlide(business.ads[currentSlide - 1]);

  return (
    <div className="max-w-[240px] bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 text-sm box-border relative">
      {/* Slide Content */}
      <div className="p-3">{content}</div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute top-1/2 left-1 transform -translate-y-1/2 text-gray-500 hover:text-black text-xs"
          >
            ◀
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-1 transform -translate-y-1/2 text-gray-500 hover:text-black text-xs"
          >
            ▶
          </button>
        </>
      )}

      {/* Slide Indicator */}
      <div className="absolute bottom-1 right-2 text-[10px] text-gray-400">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default PopupContent;
