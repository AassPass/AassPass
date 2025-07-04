'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/app/Utils/backendUrl';
import ReactDOM from 'react-dom/client';
import PopupContent from './PopupContent';

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = ({ markerData, userLocation }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [78.9629, 20.5937],
            zoom: 4.5,
        });

        const map = mapRef.current;

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true,
            }),
            'top-right'
        );

        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl,
            marker: true,
            placeholder: 'Search location...',
        });
        map.addControl(geocoder, 'top-left');

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !markerData || markerData.length === 0) return;

        // Remove old markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        markerData.forEach(({ coordinates, popupText }) => {
            const popupNode = document.createElement('div');
            ReactDOM.createRoot(popupNode).render(
                <PopupContent name={popupText} coordinates={coordinates} />
            );

            const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupNode);

            const el = document.createElement('div');
            el.className = 'custom-image-marker';
            el.innerHTML = `
        <div class="marker-image-wrapper">
          <img src="/marker.png" alt="marker" />
        </div>
      `;

            const marker = new mapboxgl.Marker(el)
                .setLngLat(coordinates)
                .setPopup(popup)
                .addTo(map);

            markersRef.current.push(marker);
        });
    }, [markerData]);

    return <div ref={mapContainerRef} className="h-full w-full" />;
};

export default Map;
