'use client';
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { MAPBOX_TOKEN } from '@/app/Utils/backendUrl';
import ReactDOM from 'react-dom/client';
import PopupContent from './PopupContent';

mapboxgl.accessToken = MAPBOX_TOKEN;

const markerData = [
    { id: 1, coordinates: [77.5946, 12.9716], popupText: 'Bangalore', color: 'red' },
    { id: 2, coordinates: [72.8777, 19.0760], popupText: 'Mumbai', color: 'blue' },
    { id: 3, coordinates: [88.3639, 22.5726], popupText: 'Kolkata', color: 'green' },
    { id: 4, coordinates: [78.4867, 17.3850], popupText: 'Hyderabad', color: 'purple' },
    { id: 5, coordinates: [77.1025, 28.7041], popupText: 'Delhi', color: 'orange' },
];

const Map = () => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) return;

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
                positionOptions: {
                    enableHighAccuracy: true,
                },
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
            markersRef.current = markerData.map(({ coordinates, popupText, color }) => {
                // Create popup node with React
                const popupNode = document.createElement('div');
                ReactDOM.createRoot(popupNode).render(
                    <PopupContent name={popupText} coordinates={coordinates} />
                );
                const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupNode);

                // Create custom marker element
                const el = document.createElement('div');
                el.className = 'custom-image-marker';

                // Add an image inside the marker
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
    }, []);

    return (
        <div className="h-screen w-full">
            <div ref={mapRef} className="h-full w-full" />
        </div>
    );
};

export default Map;
