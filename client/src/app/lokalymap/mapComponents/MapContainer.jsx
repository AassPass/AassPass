import { useEffect, useRef, useState } from 'react';
import { useMap } from './useMap';
// import { enumKeyToLabelMap } from '@/constants/enumLabels';

const enumKeyToLabelMap = {
  "RETAIL_STORE": "Retail Store",
  "RESTAURANT_CAFE": "Restaurant / Café",
  "SALON_SPA": "Salon / Spa",
  "GYM_FITNESS": "Gym / Fitness Center",
  "MEDICAL_HEALTH": "Medical / Health Store",
  "SERVICE_PROVIDER": "Service Provider",
  "FREELANCER_CONSULTANT": "Freelancer / Consultant",
  "EVENT_ORGANIZER": "Event Organizer",
  "EDUCATION_COACHING": "Education / Coaching",
  "HOME_BASED": "Home-based Business",
  "REAL_ESTATE_RENTALS": "Real Estate / Rentals",
  "COURIER_DELIVERY": "Courier / Delivery",
  "AUTOMOBILE_SERVICES": "Automobile Services",
  "PET_SERVICES": "Pet Services",
  "NGO_COMMUNITY": "NGO / Community Org.",
  "SHOP_STORE_OFFICE": "Shop/Store/Office",
  "OTHER": "Other",
};

export default function MapContainer({ businesses, userLocation, setBusinesses }) {
  const mapRef = useRef(null);
  const categoryBoxRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const { initializeMap, updateMarkersByCategory } = useMap({
    mapRef,
    businesses,
    userLocation,
    selectedCategory,
    setBusinesses
  });

  const allCategories = Object.keys(enumKeyToLabelMap);
  const visibleCategories = showAll ? allCategories : allCategories.slice(0, 6);

  useEffect(() => {
    initializeMap();
  }, [userLocation]);

  useEffect(() => {
    updateMarkersByCategory();
  }, [selectedCategory, businesses]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryBoxRef.current && !categoryBoxRef.current.contains(e.target)) {
        setShowAll(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
        <div ref={mapRef} className="w-full h-screen" />
        {/* Filter Buttons */}
        <div
            ref={categoryBoxRef}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-white px-4 py-2 rounded-xl shadow-md flex-wrap justify-center"
        >
            {selectedCategory ? (
            <>
                <button
                key={selectedCategory}
                onClick={() => setSelectedCategory(selectedCategory)}
                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white"
                >
                {enumKeyToLabelMap[selectedCategory]}
                </button>
                <button
                onClick={() => {
                    setSelectedCategory(null);
                    setShowAll(false);
                }}
                className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
                >
                Clear
                </button>
            </>
            ) : (
            <>
                {visibleCategories.map((categoryKey) => (
                <button
                    key={categoryKey}
                    onClick={() => setSelectedCategory(categoryKey)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                    {enumKeyToLabelMap[categoryKey]}
                </button>
                ))}
                {allCategories.length > 6 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                    {showAll ? 'Hide categories' : '...'}
                </button>
                )}
            </>
            )}
        </div>
    </>
  );
}
