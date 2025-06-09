'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Map from '@/app/Admin/Components/Map';
import { BACKEND_USER_URL } from '@/app/Utils/backendUrl';
import FilterOptions from '@/app/Admin/map/FilterOptions';

const MapSection = () => {
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const RADIUS_KM = 10;

    // Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
            },
            (err) => {
                console.error('Failed to get location:', err);
            }
        );
    }, []);

    // Fetch business data using location
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;

                if (userLocation) {
                    const { latitude, longitude } = userLocation; // assuming userLocation = { lat: 12.9716, long: 77.5946 }

                    response = await axios.get(`${BACKEND_USER_URL}/businesses`, {
                        params: {
                            latitude,        // backend expects 'lat'
                            longitude,  // backend expects 'lng' not 'long'
                            // radius: RADIUS_KM,
                        },
                    });
                } else {
                    console.log("User location not available, skipping fetch.");
                    return;
                }

                console.log("Business data:", response.data);

                const formatted = response.data.map((business) => ({
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
    }, [userLocation]);

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
            {/* <FilterOptions
                cities={uniqueCities}
                selectedCity={selectedCity}
                onChange={handleCityChange}
            /> */}
            <Map markerData={filteredBusinesses} />
        </div>
    );
};

export default MapSection;
