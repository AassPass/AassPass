'use client';

import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/app/Utils/backendUrl';
import FilterOptions from './FilterOptions';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('../Components/Map'), { ssr: false });

const Page = () => {
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/get-all-business`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await res.json();
                const formatted = data.map((business) => ({
                    id: business._id,
                    coordinates: [business.longitude, business.latitude],
                    popupText: business.businessName,
                    city: business.city || '',
                    color: 'red',
                }));

                setBusinesses(formatted);
                setFilteredBusinesses(formatted);
            } catch (err) {
                console.error('Error fetching business data:', err);

                // Fallback demo data
                const demoData = [
                    { id: 1, coordinates: [77.5946, 12.9716], popupText: 'Bangalore', city: 'Bangalore', color: 'red' },
                    { id: 2, coordinates: [72.8777, 19.0760], popupText: 'Mumbai', city: 'Mumbai', color: 'blue' },
                    { id: 3, coordinates: [88.3639, 22.5726], popupText: 'Kolkata', city: 'Kolkata', color: 'green' },
                    { id: 4, coordinates: [78.4867, 17.3850], popupText: 'Hyderabad', city: 'Hyderabad', color: 'purple' },
                    { id: 5, coordinates: [77.1025, 28.7041], popupText: 'Delhi', city: 'Delhi', color: 'orange' },
                ];
                setBusinesses(demoData);
                setFilteredBusinesses(demoData);
            }
        };

        fetchData();
    }, []);

    const handleCityChange = (city) => {
        setSelectedCity(city);
        if (city === '') {
            setFilteredBusinesses(businesses);
        } else {
            const filtered = businesses.filter(
                (b) => b.city.toLowerCase() === city.toLowerCase()
            );
            setFilteredBusinesses(filtered);
        }
    };

    const uniqueCities = [...new Set(businesses.map((b) => b.city).filter(Boolean))];

    return (
        <div className="w-full text-black">
            <FilterOptions
                cities={uniqueCities}
                selectedCity={selectedCity}
                onChange={handleCityChange}
            />
            <Map markerData={filteredBusinesses} />
        </div>
    );
};

export default Page;
