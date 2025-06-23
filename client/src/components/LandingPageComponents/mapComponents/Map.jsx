"use client";

import React, { useEffect, useRef } from "react";
// import { MAPBOX_TOKEN } from "@/app/Utils/backendUrl";
import ReactDOM from "react-dom/client";
import mapboxglModule from "mapbox-gl";
import { createCustomImageMarker } from "./CustomImageMarker";
// import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import PopupContent from "./PopupContent";



const Map = ({ markerData, userLocation }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  // console.log(markerData);

  // console.log(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      // const mapboxgl = await import('mapbox-gl');
      const mapboxgl = mapboxglModule.default || mapboxglModule;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: userLocation
          ? [userLocation.longitude, userLocation.latitude]
          : [78.9629, 20.5937],
        zoom: userLocation ? 12 : 4.5,
      });


      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      // Add it to the map
      map.addControl(geolocate, "top-right");

      // const geocoder = new MapboxGeocoder({
      //   accessToken: mapboxgl.accessToken,
      //   mapboxgl,
      //   marker: true,
      //   placeholder: "Search location...",
      // });  

      // map.addControl(geocoder, "top-left");

      const addMarkers = () => {
        markersRef.current = markerData.map(
          (business) => {
            const popupNode = document.createElement("div");
            ReactDOM.createRoot(popupNode).render(
              <PopupContent
                business={business}
              />
            );

            const popup = new mapboxgl.Popup({
              offset: 25,
              maxWidth: "240px",
            }).setDOMContent(popupNode);

            const el = createCustomImageMarker(business.businessType);

            const marker = new mapboxgl.Marker(el)
              .setLngLat([business.longitude, business.latitude])
              .setPopup(popup)
              .addTo(map);

            return marker;
          }
        );
      };

      const removeMarkers = () => {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      };

      const handleZoom = () => {
        const zoom = map.getZoom();
        if (zoom < 9) {
          removeMarkers();
        } else if (zoom >= 9 && markersRef.current.length === 0) {
          addMarkers();
        }
      };

      addMarkers();
      map.on("zoomend", handleZoom);
      map.on("load", () => {
        geolocate.trigger();
      });

      return () => {
        map.off("zoomend", handleZoom);
        removeMarkers();
        map.remove();
      };
    };

    loadMap();
  }, [markerData, userLocation]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default Map;
