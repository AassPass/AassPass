'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxglModule from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createCustomImageMarker } from './CustomImageMarker';
import AdView from '../Components/AdView';

const Map = ({ markerData, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const drawerRef = useRef(null);

  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const closeDrawer = () => {
    setSelectedBusinessId(null);
  };

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        closeDrawer();
      }
    };

    if (selectedBusinessId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedBusinessId]);

  // Add markers
  const addMarkers = (map) => {
    markersRef.current = markerData.map((business) => {
      const el = createCustomImageMarker(business.businessType);
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        setSelectedBusinessId(business.id); // 👈 Only pass ID
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
      zoom: userLocation ? 12 : 4.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocate, 'top-right');

    map.on('load', () => {
      geolocate.trigger();
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

      {selectedBusinessId && (
        <div
          ref={drawerRef}
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto transform transition-transform duration-300"
        >
          <AdView businessId={selectedBusinessId} onClose={closeDrawer} />
        </div>
      )}
    </div>
  );
};

export default Map;
