'use client';

import React from 'react';

const PopupContent = ({
    name,
    coordinates,
    imageUrl = '/ad-banner.jpg',
    description = 'Limited-time offer! Visit us today for exclusive deals.',
    ctaText = 'Learn More',
    websiteLink,
}) => {
    return (
        <div className="w-60 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 text-sm">
            {/* Image */}
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-24 object-cover"
            />

            {/* Content */}
            <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-gray-800 truncate">{name}</h3>

                <p className="text-xs text-gray-600 line-clamp-2">
                    {description}
                </p>

                <div className="text-[10px] text-gray-400">
                    Location: {coordinates[1]?.toFixed(2)}, {coordinates[0]?.toFixed(2)}
                </div>

                {websiteLink && (
                    <a
                        href={websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 underline hover:text-blue-800"
                    >
                        Visit Website
                    </a>
                )}

                <button className="w-full text-xs font-medium bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition">
                    {ctaText}
                </button>
            </div>
        </div>
    );
};

export default PopupContent;
