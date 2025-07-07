'use client';
import React from 'react';
import {
  FaStore,
  FaUtensils,
  FaSpa,
  FaDumbbell,
  FaBriefcaseMedical,
  FaHandsHelping,
  FaUserTie,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaHome,
  FaBuilding,
  FaTruck,
  FaCar,
  FaPaw,
  FaUsers,
  FaShoppingBag,
  FaQuestionCircle,
} from 'react-icons/fa';

const bgColorMap = {
  RETAIL_STORE: "#FF9F1C",          // Warm orange, inviting and energetic
  RESTAURANT_CAFE: "#EF476F",       // Strong pink/red, appetizing and vibrant
  SALON_SPA: "#9B5DE5",             // Deep purple, elegant and calm
  GYM_FITNESS: "#06D6A0",           // Fresh teal, active and healthy vibe
  MEDICAL_HEALTH: "#118AB2",        // Strong blue, trustworthy and professional
  SERVICE_PROVIDER: "#8D99AE",      // Cool grayish-blue, neutral and dependable
  FREELANCER_CONSULTANT: "#FFD166", // Bright yellow, optimistic and creative
  EVENT_ORGANIZER: "#FF6F91",       // Soft coral, festive and friendly
  EDUCATION_COACHING: "#06AED5",    // Bright blue, smart and clear
  HOME_BASED: "#FF8364",            // Warm coral, approachable and cozy
  REAL_ESTATE_RENTALS: "#3A86FF",   // Vivid blue, reliable and solid
  COURIER_DELIVERY: "#FFC300",      // Bold yellow, fast and attention grabbing
  AUTOMOBILE_SERVICES: "#B0BEC5",   // Light steel gray, clean and technical
  PET_SERVICES: "#FF8FAB",          // Soft pink, friendly and caring
  NGO_COMMUNITY: "#4CC9F0",         // Light sky blue, open and supportive
  SHOP_STORE_OFFICE: "#577590",     // Muted blue-gray, professional and stable
  OTHER: "#9E9E9E",                 // Neutral gray, general catch-all
};


const iconMap = {
  RETAIL_STORE: FaStore,
  RESTAURANT_CAFE: FaUtensils,
  SALON_SPA: FaSpa,
  GYM_FITNESS: FaDumbbell,
  MEDICAL_HEALTH: FaBriefcaseMedical,
  SERVICE_PROVIDER: FaHandsHelping,
  FREELANCER_CONSULTANT: FaUserTie,
  EVENT_ORGANIZER: FaCalendarAlt,
  EDUCATION_COACHING: FaChalkboardTeacher,
  HOME_BASED: FaHome,
  REAL_ESTATE_RENTALS: FaBuilding,
  COURIER_DELIVERY: FaTruck,
  AUTOMOBILE_SERVICES: FaCar,
  PET_SERVICES: FaPaw,
  NGO_COMMUNITY: FaUsers,
  SHOP_STORE_OFFICE: FaShoppingBag,
  OTHER: FaQuestionCircle,
};

export function CustomImageMarker({ businessTypeKey }) {
  const enumKey = businessTypeKey || "OTHER";
  const Icon = iconMap[enumKey] || FaQuestionCircle;
  const bgColor = bgColorMap[enumKey] || "#CBD5E0";

  return (
    <div
      style={{
        padding: '6px',
        backgroundColor: bgColor,
        borderColor:'#000000',
        borderWidth:'2px',
        borderRadius: '100%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
        cursor: 'pointer !important',
      }}
    >
      <Icon style={{ width: 15, height: 15, color: '#000' }} />
    </div>
  );
}
