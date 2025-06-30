'use client';

import React, { useEffect, useRef, useState } from "react";
import Map from "@/components/LandingPageComponents/mapComponents/Map";
import { getNearbyBusinesses } from "@/services/mapApi";
import { motion } from "framer-motion";

// const MIN_DISTANCE_METERS = 100;

// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3;
//   const toRad = (deg) => (deg * Math.PI) / 180;
//   const φ1 = toRad(lat1);
//   const φ2 = toRad(lat2);
//   const Δφ = toRad(lat2 - lat1);
//   const Δλ = toRad(lon2 - lon1);
//   const a =
//     Math.sin(Δφ / 2) ** 2 +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

const MapSection = () => {
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);

  // const lastLocationRef = useRef(null);
  // const watchIdRef = useRef(null);

  const [ userLocation, setUserLocation ] = useState({latitude: 28.676853, longitude: 77.260113});

  const fetchData = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await getNearbyBusinesses({ lat, lng, radius: 5 });
      setFilteredBusinesses(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handlePosition = (position) => {
  //   const { latitude, longitude } = position.coords;

  //   const last = lastLocationRef.current;
  //   if (last) {
  //     const distance = getDistance(last.latitude, last.longitude, latitude, longitude);
  //     if (distance < MIN_DISTANCE_METERS) return;
  //   }

  //   lastLocationRef.current = { latitude, longitude };
  //   setUserLocation({ latitude, longitude });
  //   setLocationError(false);
  //   fetchData(latitude, longitude); // ✅ Directly fetch after location update
  // };

  // const startGeoWatch = () => {
  //   const geoOptions = {
  //     enableHighAccuracy: true,
  //     timeout: 10000,
  //     maximumAge: 10000,
  //   };

  //   navigator.geolocation.getCurrentPosition(
  //     handlePosition,
  //     (err) => {
  //       console.error("Geo error:", err);
  //       setLocationError(true);
  //       setLoading(false);
  //     },
  //     geoOptions
  //   );

  //   watchIdRef.current = navigator.geolocation.watchPosition(
  //     handlePosition,
  //     (err) => {
  //       console.error("watchPosition error:", err);
  //       setLocationError(true);
  //       setLoading(false);
  //     },
  //     geoOptions
  //   );
  // };

  useEffect(() => {
    const lat = 28.676853;
    const lng = 77.260113;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // setUserLocation({longitude: lng, latitude: lat});
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
    fetchData(lat, lng);
    

    // startGeoWatch();

    // return () => {
    //   navigator.geolocation.clearWatch(watchIdRef.current);
    // };
  }, []);

  return (
    <section className="w-full py-6 px-4 sm:px-6 bg-gradient-to-r from-[#0b161c] to-[#201446] text-white min-h-[400px] flex justify-center items-center">
      <div className="w-full sm:w-[90vw] h-[60vh] sm:h-[80vh] flex flex-row gap-4">
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
                startGeoWatch();
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
              <div className="w-full h-full overflow-hidden rounded-xl shadow-lg">
                <Map markerData={filteredBusinesses} userLocation={userLocation} />
              </div>
            </motion.div>

            <div className="hidden sm:block sm:w-1/3 h-full p-4">
              <div className="bg-white text-black p-4 rounded shadow h-full">
                <p className="font-bold mb-2">Nearby Businesses</p>
                <p>This space can be used to show filters, list view, or ads.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MapSection;
