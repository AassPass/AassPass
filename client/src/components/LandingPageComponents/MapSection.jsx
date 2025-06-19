"use client"

import React, { useEffect, useRef, useState } from "react";
import Map from "@/components/LandingPageComponents/mapComponents/Map";
import { BACKEND_USER_URL } from "@/app/Utils/backendUrl";

const RADIUS_KM = 20;
const MIN_DISTANCE_METERS = 100;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

const MapSection = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const lastLocationRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchData = async (lat, lng) => {
    try {
      const url = new URL(`${BACKEND_USER_URL}/businesses`);
      url.searchParams.append("lat", lat);
      url.searchParams.append("lng", lng);
      url.searchParams.append("radius", RADIUS_KM);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setBusinesses(data.data);
      setFilteredBusinesses(data.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (lastLocationRef.current) {
          const distance = getDistance(
            lastLocationRef.current.latitude,
            lastLocationRef.current.longitude,
            latitude,
            longitude
          );

          if (distance < MIN_DISTANCE_METERS) return; // Skip if less than 100m
        }

        lastLocationRef.current = { latitude, longitude };
        setUserLocation({ latitude, longitude });

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          fetchData(latitude, longitude);
        }, 3000); // debounce fetch
      },
      (err) => {
        console.error("Failed to get location:", err);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <section className="w-full flex justify-center items-center py-6 bg-gray-50 text-black">
      <div className="w-[60vw] h-[80vh]">
        <div className="w-full h-full">
          <Map markerData={filteredBusinesses} userLocation={userLocation} />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
