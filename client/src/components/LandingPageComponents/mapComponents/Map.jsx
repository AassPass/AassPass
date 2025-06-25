"use client";

import React, { useEffect, useRef } from "react";
import mapboxglModule from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createCustomImageMarker } from "./CustomImageMarker";

const Map = ({ markerData, userLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Function to build plain HTML carousel for popups
  const createPopupHTML = (business) => {
    const firstAd = business.ads?.[0] || {};
    return `
  <div class="popup-carousel" style="
    max-width: 360px;
    font-family: 'Segoe UI', sans-serif;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    background: #fff;
  ">
    <div class="carousel-slide" style="padding: 12px;">
      <img 
        src="${firstAd?.images?.[0]?.url || "/placeholder.png"}" 
        alt="Ad Image" 
        style="width: 100%; height: 140px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" 
      />
      <h3 style="font-size: 16px; font-weight: 600; color: #1d4ed8; margin: 0 0 6px;">
        ${firstAd?.title || business.businessName}
      </h3>
      <p style="font-size: 13px; color: #475569; margin: 2px 0;">
        ${firstAd?.category || business.businessType}
      </p>
      <p style="font-size: 13px; color: #64748b; margin: 2px 0;">
        📞 ${business.phoneNumber || "N/A"}
      </p>
      ${business.websiteLink
        ? `<a href="${business.websiteLink}" target="_blank" style="font-size: 13px; color: #2563eb; text-decoration: underline;">🌐 Website</a>`
        : ""
      }
    </div>
    <div style="
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background-color: #f1f5f9;
      border-top: 1px solid #e2e8f0;
    ">
      <button class="prev-slide" style="
        font-size: 18px;
        background: none;
        border: none;
        cursor: pointer;
        color: #1e293b;
      ">⟵</button>
      <span style="font-size: 12px; color: #64748b;">1 / ${business.ads?.length || 1}</span>
      <button class="next-slide" style="
        font-size: 18px;
        background: none;
        border: none;
        cursor: pointer;
        color: #1e293b;
      ">⟶</button>
    </div>
  </div>
`;

  };

  // Add all markers
  const addMarkers = (map) => {
    markersRef.current = markerData.map((business) => {
      const popup = new mapboxglModule.Popup({
        offset: 25,
        maxWidth: "240px",
      }).setHTML(createPopupHTML(business));

      const el = createCustomImageMarker(business.businessType);

      const marker = new mapboxglModule.Marker(el)
        .setLngLat([business.longitude, business.latitude])
        .setPopup(popup)
        .addTo(map);

      // When popup opens, attach JS carousel logic
      marker.getElement().addEventListener("click", () => {
        setTimeout(() => {
          const popupEl = document.querySelector(".popup-carousel");
          if (!popupEl) return;

          const slides = business.ads || [];
          let current = 0;

          const updateSlide = () => {
            const ad = slides[current];
            if (!ad) return;

            popupEl.querySelector("img").src = ad.images?.[0]?.url || "/placeholder.png";
            popupEl.querySelector("h3").textContent = ad.title || "";
            popupEl.querySelector("p").textContent = ad.category || "";
          };

          const prevBtn = popupEl.querySelector(".prev-slide");
          const nextBtn = popupEl.querySelector(".next-slide");

          if (prevBtn && nextBtn && slides.length > 1) {
            prevBtn.onclick = () => {
              current = (current - 1 + slides.length) % slides.length;
              updateSlide();
            };
            nextBtn.onclick = () => {
              current = (current + 1) % slides.length;
              updateSlide();
            };
          } else {
            // Hide buttons if no slides
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
          }
        }, 100);
      });

      return marker;
    });
  };

  const removeMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  // Main map initialization
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    const mapboxgl = mapboxglModule.default || mapboxglModule;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/aasspass/cmcbj135600ds01sibtg215yi",
      center: userLocation
        ? [userLocation.longitude, userLocation.latitude]
        : [78.9629, 20.5937],
      zoom: userLocation ? 12 : 4.5,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.addControl(geolocate, "top-right");

    map.on("load", () => {
      geolocate.trigger();
      addMarkers(map);
    });

    map.on("zoomend", () => {
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

  // Update markers on data change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    removeMarkers();
    addMarkers(mapInstanceRef.current);
  }, [markerData]);

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default Map;
