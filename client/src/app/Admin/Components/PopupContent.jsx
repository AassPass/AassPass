'use client';
import React from 'react';

const PopupContent = ({
    name,
    coordinates,
    imageUrl = '/ad-banner.jpg',
    description = 'Limited-time offer! Visit us today for exclusive deals.',
    ctaText = 'Learn More'
}) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-md shadow-gray-500/20 overflow-hidden border border-gray-200">
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-28 object-cover"
            />
            <div className="p-3">
                <h3 className="text-base font-bold text-gray-800 mb-1">{name}</h3>
                <p className="text-xs text-gray-600 mb-2">
                    {description}
                </p>
                <div className="text-[10px] text-gray-400 mb-2">
                    Location: {coordinates[1].toFixed(2)}, {coordinates[0].toFixed(2)}
                </div>
                <button className="w-full text-xs font-semibold bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition duration-200">
                    {ctaText}
                </button>
            </div>
        </div>
    );
};

export default PopupContent;
