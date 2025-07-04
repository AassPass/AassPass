"use client";

import { useEffect, useRef, useState } from 'react';
import { useMap } from './useMap';
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import AdView from './AdView';
import { enumKeyToLabelMap } from '@/lib/utils';
import { useDrawerDirection } from './useDrawerDirection';

export default function MapContainer({ businesses, userLocation, setBusinesses }) {
  const mapRef = useRef(null);
  const categoryBoxRef = useRef(null);
  const drawerDirection = useDrawerDirection()

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const { initializeMap, updateMarkersByCategory } = useMap({
    mapRef,
    businesses,
    userLocation,
    selectedCategory,
    setBusinesses,
    open: (business) => {
      setSelectedBusiness(business);
      setDrawerOpen(true);
    }
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
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction={drawerDirection}>
          <DrawerContent side="right" className="w-full max-w-md h-full p-4 overflow-y-auto bg-gradient-to-r from-[#2b509c] to-[#3a1e90]">
            <AdView selectedBusiness={selectedBusiness}/>
          </DrawerContent>
        </Drawer>
        <div ref={mapRef} className="w-full h-[100dvh]" />
        {/* Filter Buttons */}
        <div
          ref={categoryBoxRef}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 bg-white px-2 py-1 rounded-xl shadow-md flex-wrap justify-center max-w-[95%]"
        >
          {selectedCategory ? (
            <>
              <button
                key={selectedCategory}
                onClick={() => setSelectedCategory(selectedCategory)}
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-600 text-white"
              >
                {enumKeyToLabelMap[selectedCategory]}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setShowAll(false);
                }}
                className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
              >
                Clear
              </button>
            </>
          ) : (
            <>
              {visibleCategories
                .slice(0, showAll ? visibleCategories.length : (window.innerWidth < 640 ? 4 : 8))
                .map((categoryKey) => (
                  <button
                    key={categoryKey}
                    onClick={() => setSelectedCategory(categoryKey)}
                    className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {enumKeyToLabelMap[categoryKey]}
                  </button>
                ))}
              {allCategories.length > (window.innerWidth < 640 ? 4 : 8) && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {showAll ? 'Hide' : '...'}
                </button>
              )}
            </>
          )}
        </div>

    </>
  );
}
