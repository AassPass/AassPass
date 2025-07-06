"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "./useMap";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import AdView from "./AdView";
import { enumKeyToLabelMap } from "@/lib/utils";
import { useDrawerDirection } from "./useDrawerDirection";
import CategoryFilter from "./CategoryFilter";

export default function MapContainer({
  businesses,
  userLocation,
  setBusinesses,
}) {
  const mapRef = useRef(null);
  const categoryBoxRef = useRef(null);
  const drawerDirection = useDrawerDirection();

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
    },
  });

  const allCategories = Object.keys(enumKeyToLabelMap);
  // const visibleCategories = showAll ? allCategories : allCategories.slice(0, 6);

  useEffect(() => {
    initializeMap();
  }, [userLocation]);

  useEffect(() => {
    updateMarkersByCategory();
  }, [selectedCategory, businesses]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryBoxRef.current &&
        !categoryBoxRef.current.contains(e.target)
      ) {
        setShowAll(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        direction={drawerDirection}
      >
        <DrawerContent
          side="right"
          className="w-full max-w-md p-4 h-[70dvh] sm:h-screen overflow-y-auto bg-gradient-to-r from-[#2b509c] to-[#3a1e90]"
        >
          <AdView selectedBusiness={selectedBusiness} />
        </DrawerContent>
      </Drawer>
      <div ref={mapRef} className="w-full h-[100dvh]" />
      {/* Filter Buttons */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allCategories={allCategories}
        enumKeyToLabelMap={enumKeyToLabelMap}
      />
    </>
  );
}
