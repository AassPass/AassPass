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

    // Get user location once on mount
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

    // Fetch businesses whenever userLocation changes
    useEffect(() => {
        if (!userLocation) return; // skip if no location

        const fetchData = async () => {
            try {
                const { latitude, longitude } = userLocation;
                console.log(userLocation);
                const response = await axios.get(`${BACKEND_USER_URL}/businesses`, {
                    params: {
                        lat: latitude,
                        lng: longitude,
                        radius: RADIUS_KM,
                    },
                });
                console.log(response.data);

                if (userLocation) {
                    const { latitude, longitude } = userLocation; // assuming userLocation = { lat: 12.9716, long: 77.5946 }

                    response = await axios.get(`${BACKEND_USER_URL}/businesses`, {
                        params: {
                            lat: latitude,        // backend expects 'lat'
                            lng: longitude,  // backend expects 'lng' not 'long'
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
                    city: business.city || "",
                    color: "red",
                    websiteLink: business.websiteLink || "",
                }));


                setBusinesses(formatted);
                setFilteredBusinesses(formatted);
            } catch (error) {
                console.error('Error fetching business data:', error);
                // Optionally set fallback data here
            }
        };

        fetchData();
    }, [userLocation]);




    return (
        <div className="w-full text-black">
            {/* Uncomment to enable city filtering */}
            {/* <div>

                <FilterOptions
                    cities={uniqueCities}
                    selectedCity={selectedCity}
                    onChange={handleCityChange}
                />
            </div> */}
            <div>

                <Map markerData={businesses} />
            </div>
        </div>
    );
};

export default MapSection;
