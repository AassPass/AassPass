'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxglModule from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { createCustomImageMarker } from './CustomImageMarker';
import AdView from './AdView';
import { getNearbyBusinesses } from '@/services/mapApi';

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

const Map = ({ businesses, setBusinesses, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const categoryBoxRef = useRef(null);
  
  // console.log(businesses);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const allCategories = Object.keys(enumKeyToLabelMap);
  const visibleCategories = showAll ? allCategories : allCategories.slice(0, 6);

  const filteredData = !selectedCategory
  ? businesses
  : businesses.filter((b) => b.businessType === selectedCategory);

  const addMarkers = (map, data) => {
    markersRef.current = data.map((business) => {
      const el = createCustomImageMarker(business.businessType);
      el.style.cursor = 'pointer';

      const marker = new mapboxglModule.Marker(el)
        .setLngLat([business.longitude, business.latitude])
        .addTo(map);

      marker.businessType = business.businessType;
      
      return marker;
    });
  };

  const updateMarkerVisibility = (category) => {
    markersRef.current.forEach((marker) => {
      const isVisible =
        category === null || marker.businessType === category;

      const markerEl = marker.getElement();
      markerEl.style.display = isVisible ? 'block' : 'none';
    });
  };

  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const mapboxgl = mapboxglModule.default || mapboxglModule;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/aasspass/cmcbj135600ds01sibtg215yi',
      center: userLocation
        ? [userLocation.longitude, userLocation.latitude]
        : [78.9629, 20.5937],
      zoom: 12,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: 'Search places...',
    });

    map.addControl(geocoder, 'top-left');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(geolocate, 'top-right');

    map.on('load', () => {
      setBusinesses(getNearbyBusinesses());
      addMarkers(map, filteredData);
    });

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      if (zoom < 9) {
        removeMarkers();
      } else if (zoom >= 9 && markersRef.current.length === 0) {
        addMarkers(map, filteredData);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      removeMarkers();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // First time or when businesses change, reset all markers
    if (markersRef.current.length === 0) {
      addMarkers(mapInstanceRef.current, businesses);
    }

    // Then, filter visibility
    updateMarkerVisibility(selectedCategory);
  }, [businesses, selectedCategory]);

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
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

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
    </div>
  );
};

export default Map;
