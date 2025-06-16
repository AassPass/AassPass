const labelToEnumKeyMap = {
  "Retail Store": "RETAIL_STORE",
  "Restaurant / Café": "RESTAURANT_CAFE",
  "Salon / Spa": "SALON_SPA",
  "Gym / Fitness Center": "GYM_FITNESS",
  "Medical / Health Store": "MEDICAL_HEALTH",
  "Service Provider": "SERVICE_PROVIDER",
  "Freelancer / Consultant": "FREELANCER_CONSULTANT",
  "Event Organizer": "EVENT_ORGANIZER",
  "Education / Coaching": "EDUCATION_COACHING",
  "Home-based Business": "HOME_BASED",
  "Real Estate / Rentals": "REAL_ESTATE_RENTALS",
  "Courier / Delivery": "COURIER_DELIVERY",
  "Automobile Services": "AUTOMOBILE_SERVICES",
  "Pet Services": "PET_SERVICES",
  "NGO / Community Org.": "NGO_COMMUNITY",
  "Shop/Store/Office": "SHOP_STORE_OFFICE",
  "Other": "OTHER",
};

const bgColorMap = {
  RETAIL_STORE: "#FFF4E5",
  RESTAURANT_CAFE: "#FFEAEA",
  SALON_SPA: "#F9F0FF",
  GYM_FITNESS: "#E5F4F4",
  MEDICAL_HEALTH: "#E5F6FF",
  SERVICE_PROVIDER: "#F2F2F2",
  FREELANCER_CONSULTANT: "#FFFCE5",
  EVENT_ORGANIZER: "#FDEBF9",
  EDUCATION_COACHING: "#EEF9F1",
  HOME_BASED: "#FFF0F0",
  REAL_ESTATE_RENTALS: "#EAF4FF",
  COURIER_DELIVERY: "#FFF8E5",
  AUTOMOBILE_SERVICES: "#F4F4F4",
  PET_SERVICES: "#FFF0FA",
  NGO_COMMUNITY: "#E7F7F2",
  SHOP_STORE_OFFICE: "#F5F5FF",
  OTHER: "#F0F0F0",
};

const iconMap = {
  RETAIL_STORE: '/icons/retail_store.svg',
  RESTAURANT_CAFE: '/icons/restaurant_cafe.svg',
  SALON_SPA: '/icons/salon_spa.svg',
  GYM_FITNESS: '/icons/gym_fitness.svg',
  MEDICAL_HEALTH: '/icons/medical_health.svg',
  SERVICE_PROVIDER: '/icons/service_provider.svg',
  FREELANCER_CONSULTANT: '/icons/freelancer_consultant.svg',
  EVENT_ORGANIZER: '/icons/event_organizer.svg',
  EDUCATION_COACHING: '/icons/education_coaching.svg',
  HOME_BASED: '/icons/home_based_business.svg',
  REAL_ESTATE_RENTALS: '/icons/real_estate_rentals.svg',
  COURIER_DELIVERY: '/icons/courier_delivery.svg',
  AUTOMOBILE_SERVICES: '/icons/automobile_services.svg',
  PET_SERVICES: '/icons/pet_services.svg',
  NGO_COMMUNITY: '/icons/ngo.svg',
  SHOP_STORE_OFFICE: '/icons/store_office.svg',
  OTHER: '/icons/others.svg',
};

// export function createCustomImageMarker(businessTypeLabel) {
//   const enumKey = labelToEnumKeyMap[businessTypeLabel] || "OTHER";
//   const iconSrc = iconMap[enumKey];

//   const el = document.createElement("div");
//   el.className = "custom-image-marker";
//   el.innerHTML = `
//     <div class="marker-image-wrapper" style="padding: 6px;">
//       <img src="${iconSrc}" alt="${businessTypeLabel}" style="width: 100%; height: 100%; object-fit: contain;" />
//     </div>
//   `;
//   return el;
// }

export function createCustomImageMarker(businessTypeLabel) {
  const enumKey = labelToEnumKeyMap[businessTypeLabel] || "OTHER";
  const iconSrc = iconMap[enumKey];
  const bgColor = bgColorMap[enumKey] || "#F0F0F0";

  const el = document.createElement("div");
  el.className = "custom-image-marker";
  el.innerHTML = `
    <div class="marker-image-wrapper" style="padding: 6px; background-color: ${bgColor};">
      <img src="${iconSrc}" alt="${businessTypeLabel}" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `;
  return el;
}

