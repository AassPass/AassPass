'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxglModule from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createCustomImageMarker } from './CustomImageMarker';
import AdView from './AdView';

const Map = ({ markerData, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const drawerRef = useRef(null);

  // console.log("markerData: ", markerData);
  // console.log("userLocation: ", userLocation);
  
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  
  const closeDrawer = () => {
    setSelectedBusiness(null);
  };
  
  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        closeDrawer();
      }
    };
    
    if (selectedBusiness) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBusiness]);
  
  // Add markers
  const addMarkers = (map) => {
    markersRef.current = markerData.map((business) => {
      // console.log(business);
      const el = createCustomImageMarker(business.businessType);
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        setSelectedBusiness(business);
      });
      
      const marker = new mapboxglModule.Marker(el)
      .setLngLat([business.longitude, business.latitude])
      .addTo(map);
      
      return marker;
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

    // console.log("userLocation: ", userLocation);
    
    
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(geolocate, 'top-right');

    map.on('load', () => {
      // geolocate.trigger();
      addMarkers(map);
    });

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      if (zoom < 9) {
        removeMarkers();
      } else if (zoom >= 9 && markersRef.current.length === 0) {
        addMarkers(map);
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
    removeMarkers();
    addMarkers(mapInstanceRef.current);
  }, [markerData]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />

      {selectedBusiness && (
        <div
          ref={drawerRef}
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ${selectedBusiness ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {selectedBusiness && (
            <AdView business={selectedBusiness} onClose={closeDrawer} />
          )}
        </div>
      
      )}
    </div>
  );
};

export default Map;
