"use client";

import React, { useEffect, useState } from "react";
import Map from "@/components/LandingPageComponents/mapComponents/Map";
import { BACKEND_USER_URL } from "@/app/Utils/backendUrl";
import FilterOptions from "@/app/Admin/map/FilterOptions";

const MapSection = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  // const [selectedCity, setSelectedCity] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const RADIUS_KM = 20;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (err) => {
        console.error("Failed to get location:", err);
      }
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      try {
        const { latitude, longitude } = userLocation;

        const url = new URL(`${BACKEND_USER_URL}/businesses`);
        url.searchParams.append("lat", latitude);
        url.searchParams.append("lng", longitude);
        url.searchParams.append("radius", RADIUS_KM);

        const response = await fetch(url.toString());
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log(data);

        // const formatted = data.data.map((business) => ({
        //   id: business.id,
        //   coordinates: [business.longitude, business.latitude],
        //   businessType: business.businessType,
        //   popupText: business.businessName,
        //   city: business.city || "",
        //   color: "red",
        //   websiteLink: business.websiteLink || "",
        // }));

        setBusinesses(data.data);
        setFilteredBusinesses(data.data);
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    };

    fetchData();
  }, [userLocation]);

  return (
    <section className="w-full flex justify-center items-center py-6 bg-gray-50 text-black">
      <div className="w-[60vw] h-[80vh]">
        {/* FilterOptions can be re-enabled here */}
        {/* <FilterOptions
                    cities={uniqueCities}
                    selectedCity={selectedCity}
                    onChange={handleCityChange}
                /> */}

        {/* <div className="w-full h-[60vh] sm:h-[70vh] lg:h-[75vh] rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white"> */}
        <div className="w-full h-full">
          <Map markerData={filteredBusinesses} userLocation={userLocation} />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
