"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxglModule from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { getNearbyBusinesses } from '@/services/mapApi';
import { debounce, distanceBetweenTwoCoord } from '@/lib/utils';
import { createCustomImageMarker } from './createCustomImageMarker';



export const useMap = ({ mapRef, businesses, userLocation, selectedCategory, setBusinesses, open }) => {
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [lastLocation, setLastLocation] = useState({lat:0, lng:0});

  useEffect(() => {
    setLastLocation(userLocation);
  }, [userLocation]);

  const addMarkers = (map, data, onMarkerClick, mapboxgl) => {
    markersRef.current = data.map((b) => {
      const el = createCustomImageMarker(b.businessType);
      el.addEventListener('click', () => {
        console.log('Marker clicked');
        console.log(b);
        onMarkerClick(b);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([b.longitude, b.latitude])
        .addTo(map);
      marker.businessType = b.businessType;
      return marker;
    });
  };


  const removeMarkers = () => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  };

  const updateMarkersByCategory = () => {
    markersRef.current.forEach((m) => {
      m.getElement().style.display =
        !selectedCategory || m.businessType === selectedCategory
          ? 'block'
          : 'none';
    });
  };

  const initializeMap = () => {
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

    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    // map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        placeholder: 'Search places...',
      }),
      'top-left'
    );
    
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      'top-left'
    );


    map.on('load', () => {
      addMarkers(map, businesses, open, mapboxgl);
    });

    // Attach to map
    map.on('moveend', debounce(async () => {
      const center = map.getCenter();
      // console.log("Map center moved to:", center);

      if (distanceBetweenTwoCoord(lastLocation, center) > 1000) {
        try {
          const response = await getNearbyBusinesses({
            lat: center.lat,
            lng: center.lng,
            radius: 10,
          });

          if (response?.data) {
            setBusinesses(response.data); // update state with new businesses
            console.log("Fetched new businesses:", response.data);

            userLocation = { lat: center.lat, lng: center.lng };
            removeMarkers();
            addMarkers(map, response.data, open, mapboxgl);
            setLastLocation(center);
          }
        } catch (error) {
          console.error("Error fetching businesses:", error);
        }
      }
    }, 500));


    map.on('zoomend', () => {
      const zoom = map.getZoom();
      if (zoom < 9) {
        removeMarkers();
      } else if (zoom >= 9 && markersRef.current.length === 0) {
        addMarkers(map, businesses);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      removeMarkers();
      map.remove();
      mapInstanceRef.current = null;
    };
  };

  return {
    initializeMap,
    updateMarkersByCategory,
  };
};
