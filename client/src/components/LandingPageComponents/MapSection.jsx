"use client";

import React, { useEffect, useRef, useState } from "react";
import Map from "@/components/LandingPageComponents/mapComponents/Map";
import { getNearbyBusinesses } from "@/services/mapApi";

const MIN_DISTANCE_METERS = 100;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const MapSection = () => {
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const lastLocationRef = useRef(null);
  const debounceRef = useRef(null);
  const initialFetchDoneRef = useRef(false);
  const watchIdRef = useRef(null);

  const fetchIPLocation = async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
    } catch (err) {
      console.warn("IP fallback failed:", err);
      return null;
    }
  };

  const fetchData = async (lat, lng) => {
    try {
      const response = await getNearbyBusinesses({ lat, lng, radius: 5 });
      setFilteredBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

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
    setLoading(false);
    setLocationError(false);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = initialFetchDoneRef.current ? 1000 : 0;

    debounceRef.current = setTimeout(() => {
      fetchData(latitude, longitude);
      initialFetchDoneRef.current = true;
    }, delay);
  };

  const startGeoWatch = () => {
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    };

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      () => {
        setLocationError(true);
        setLoading(false);
      },
      geoOptions
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      () => { },
      geoOptions
    );
  };

  useEffect(() => {
    fetchIPLocation().then((ipLocation) => {
      if (ipLocation) {
        setUserLocation(ipLocation);
        fetchData(ipLocation.latitude, ipLocation.longitude);
      }
      setLoading(false);
    });

    startGeoWatch();

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <section className="w-full flex justify-center items-center py-6 px-4 sm:px-6 bg-gradient-to-r from-[#0b161c] to-[#201446] text-white min-h-[400px]">
      <div className="w-full sm:w-[60vw] h-[60vh] sm:h-[80vh] flex justify-center items-center">
        {loading ? (
          <div className="text-center text-lg animate-pulse">
            Getting your location...
          </div>
        ) : locationError && !userLocation ? (
          <div className="text-center">
            <p className="mb-2">Location access is required to show nearby businesses.</p>
            <button
              className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100"
              onClick={() => {
                setLoading(true);
                startGeoWatch();
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="w-full h-full">
            <Map markerData={filteredBusinesses} userLocation={userLocation} />
          </div>
        )}
      </div>
    </section>
  );
};

export default MapSection;
