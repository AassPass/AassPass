"use client"

import React, { useEffect, useRef, useState } from "react";
import Map from "@/components/LandingPageComponents/mapComponents/Map";
import { getNearbyBusinesses } from "@/services/mapApi";

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
  // const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const lastLocationRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchData = async (lat, lng) => {
    try {
      const response = await getNearbyBusinesses({ lat, lng, radius: 5 });
      const businesses = response.data;
      // setBusinesses(businesses);
      setFilteredBusinesses(businesses);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  useEffect(() => {
    const handlePosition = (position) => {
      const { latitude, longitude } = position.coords;

      if (lastLocationRef.current) {
        const distance = getDistance(
          lastLocationRef.current.latitude,
          lastLocationRef.current.longitude,
          latitude,
          longitude
        );

        if (distance < MIN_DISTANCE_METERS) return;
      }

      lastLocationRef.current = { latitude, longitude };
      setUserLocation({ latitude, longitude });

      // Only debounce if it's not the first fetch
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        fetchData(latitude, longitude);
      }, lastLocationRef.current ? 3000 : 0);
    };

    // First fetch with current position
    navigator.geolocation.getCurrentPosition(
      handlePosition,
      (err) => {
        console.error("Failed to get initial location:", err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Start watching for location changes
    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => {
        console.error("Failed to get location:", err);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);


  return (
    <section className="w-full flex justify-center items-center py-6 px-4 sm:px-6 bg-gray-50 text-black bg-gradient-to-r from-[#0b161c] to-[#201446]">
      <div className="w-full sm:w-[60vw] h-[60vh] sm:h-[80vh]">
        <div className="w-full h-full">
          <Map markerData={filteredBusinesses} userLocation={userLocation} />
        </div>
      </div>
    </section>

  );
};

export default MapSection;