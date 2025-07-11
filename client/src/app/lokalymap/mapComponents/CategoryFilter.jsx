'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useRef } from "react";

export default function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
  allCategories,
  enumKeyToLabelMap,
}) {
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = allCategories;

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] sm:w-[50%]">
      <ScrollArea className="whitespace-nowrap rounded-xl bg-white shadow-md px-2 py-1">
        <div className="flex gap-2 items-center pb-2">
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
              {displayedCategories.map((categoryKey) => (
                <button
                  key={categoryKey}
                  onClick={() => setSelectedCategory(categoryKey)}
                  className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  {enumKeyToLabelMap[categoryKey]}
                </button>
              ))}
              {showAll && allCategories.length && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  Hide
                </button>
              )}
            </>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
