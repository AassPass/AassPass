import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function distanceBetweenTwoCoord(coord1, coord2) {
  const R = 6371000; // Earth's radius in meters
  const toRadians = (deg) => (deg * Math.PI) / 180;

  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export const enumKeyToLabelMap = {
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