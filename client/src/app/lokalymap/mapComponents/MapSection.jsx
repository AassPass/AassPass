'use client';

import React, { useEffect, useRef, useState } from "react";
import Map from "@/app/lokalymap/mapComponents/Map";
import { getNearbyBusinesses } from "@/services/mapApi";
import { motion } from "framer-motion";
import MapContainer from "./MapContainer";

const MapSection = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  const [ userLocation, setUserLocation ] = useState({latitude: 0, longitude: 0});

  const fetchData = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await getNearbyBusinesses({ lat, lng, radius: 5 });
      // console.log(response.data);
      setBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lat = 28.676853;
    const lng = 77.260113;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ longitude: userLng, latitude: userLat });
        await fetchData(userLat, userLng);
      },
      async (error) => {
        console.error("Error getting user location:", error);
        // fallback fetch using default coords
        await fetchData(lat, lng);
      }
    );
    fetchData(lat, lng);
  }, []);

  return (
    <section className="w-screen min-h-[100dvh] bg-gradient-to-r from-[#0b161c] to-[#201446] text-white flex justify-center items-center">
      <div className="w-full h-full flex flex-row gap-4">
        {loading ? (
          <div className="text-center text-lg animate-pulse flex-1 flex items-center justify-center">
            Getting your location...
          </div>
        ) : locationError && !userLocation ? (
          <div className="text-center flex-1 flex flex-col justify-center items-center">
            <p className="mb-2">
              Location access is required to show nearby businesses.
            </p>
            <button
              className="bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-100"
              onClick={() => {
                setLoading(true);
                setLocationError(false);
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <motion.div
              className="w-full h-full origin-center"
              initial={{ opacity: 0, filter: 'blur(4px)', scale: 0.98 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-center items-center w-full flex-1 overflow-hidden shadow-lg">
                <MapContainer businesses={businesses} setBusinesses={setBusinesses} userLocation={userLocation} />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default MapSection;
