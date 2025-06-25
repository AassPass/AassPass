'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/app/Utils/backendUrl';
import ReactDOM from 'react-dom/client';
import PopupContent from './PopupContent';

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = ({ markerData }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current || markerData.length === 0) return;

        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [78.9629, 20.5937],
            zoom: 4.5,
        });

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
            mapboxgl: mapboxgl,
            marker: true,
            placeholder: 'Search location...',
        });
        map.addControl(geocoder, 'top-left');

        const addMarkers = () => {
            markersRef.current = markerData.map(({ coordinates, popupText }) => {
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

                return marker;
            });
        };

        const removeMarkers = () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };

        const handleZoom = () => {
            const zoom = map.getZoom();
            if (zoom < 4) {
                removeMarkers();
            } else if (zoom >= 4 && markersRef.current.length === 0) {
                addMarkers();
            }
        };

        addMarkers();
        map.on('zoomend', handleZoom);

        return () => {
            map.off('zoomend', handleZoom);
            removeMarkers();
            map.remove();
        };
    }, [markerData]);

    return (
        <div className="h-screen w-full">
            <div ref={mapRef} className="h-full w-full" />
        </div>
    );
};

export default Map;
