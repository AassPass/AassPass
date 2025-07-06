import lottie from 'lottie-web';

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
  RETAIL_STORE: "#FFB347",         // bolder orange
  RESTAURANT_CAFE: "#FF6B6B",      // bolder red-pink
  SALON_SPA: "#C084FC",            // bolder violet
  GYM_FITNESS: "#38B2AC",          // teal
  MEDICAL_HEALTH: "#63B3ED",       // bolder sky blue
  SERVICE_PROVIDER: "#A0AEC0",     // medium gray
  FREELANCER_CONSULTANT: "#F6E05E",// rich yellow
  EVENT_ORGANIZER: "#F687B3",      // vibrant pink
  EDUCATION_COACHING: "#68D391",   // stronger green
  HOME_BASED: "#FC8181",           // light red
  REAL_ESTATE_RENTALS: "#63B3ED",  // sky blue
  COURIER_DELIVERY: "#ECC94B",     // deeper yellow
  AUTOMOBILE_SERVICES: "#CBD5E0",  // medium-light gray
  PET_SERVICES: "#FBB6CE",         // deeper pastel pink
  NGO_COMMUNITY: "#81E6D9",        // aqua
  SHOP_STORE_OFFICE: "#A3BFFA",    // bolder lavender-blue
  OTHER: "#CBD5E0",                // soft gray-blue
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

export function createCustomImageMarker(businessTypeLabel, index = Math.random()) {
  const iconSrc = iconMap[businessTypeLabel] || iconMap.OTHER;
  const bgColor = bgColorMap[businessTypeLabel] || "#F0F0F0";
  const sparkleId = `sparkle-${index.toString().replace('.', '')}`;

  const el = document.createElement("div");
  el.className = "custom-image-marker";
  el.innerHTML = `
    <div class="marker-image-wrapper" style="padding: 6px; background-color: ${bgColor};">
      <img src="${iconSrc}" alt="${businessTypeLabel}" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `;

  // Removed sparkle (Lottie animation) related code

  return el;
}
