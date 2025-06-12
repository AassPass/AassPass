import { randomBytes } from 'crypto';


const generatePassword = (length = 12) => {
  return randomBytes(length).toString('base64').slice(0, length);
};

const businessTypeMap = {
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

export { generatePassword, businessTypeMap };


