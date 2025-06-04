'use client';

import React from 'react';

const FilterOptions = ({ cities, selectedCity, onChange }) => {
    return (
        <div className="p-4 bg-gray-100 shadow z-10 flex items-center gap-3">
            <label htmlFor="city-select" className="font-semibold">
                Filter by City:
            </label>
            <select
                id="city-select"
                className="p-2 border rounded"
                value={selectedCity}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">All</option>
                {cities.map((city, index) => (
                    <option key={index} value={city}>
                        {city}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterOptions;
