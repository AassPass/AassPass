export function validateAdForm(form) {
  const errors = {};

  // Common fields validation
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.adType) errors.adType = "Please select an ad type";
  if (!form.visibleFrom) errors.visibleFrom = "Start date required";
  if (!form.visibleTo) errors.visibleTo = "End date required";
  if (form.visibleFrom && form.visibleTo && form.visibleTo < form.visibleFrom)
    errors.visibleTo = "End date cannot be before start date";

 const hasAtLeastOneImage = Object.values(form.images).some(Boolean);
if (!hasAtLeastOneImage) errors.images = "At least one image is required";
  const md = form.metadata || {};

  switch (form.adType) {
    case "Deals & Discounts":
      if (!md.description) errors.description = "Description required";
      if (
        md.discountPercentage === undefined ||
        md.discountPercentage === ""
      )
        errors.discountPercentage = "Discount % required";
      if (!md.validTill) errors.validTill = "Valid Till date required";
      if (!md.terms) errors.terms = "Terms required";
      break;

    case "Events":
      if (!md.description) errors.description = "Description required";
      if (!md.organizerName) errors.organizerName = "Organizer Name required";
      if (!md.location) errors.location = "Event Location required";
      if (!md.time) errors.time = "Event Time required";
      if (!md.rsvp) errors.rsvp = "RSVP info required";
      break;

    case "Services":
      if (!md.description) errors.description = "Description required";
      if (!md.serviceType) errors.serviceType = "Service Type required";
      if (!md.contact) errors.contact = "Contact required";
      if (!md.radius) errors.radius = "Service Radius required";
      break;

    case "Products for Sale":
      if (!md.description) errors.description = "Description required";
      if (md.price === undefined || md.price === "")
        errors.price = "Price required";
      if (
        md.quantityAvailable === undefined ||
        md.quantityAvailable === ""
      )
        errors.quantityAvailable = "Quantity available required";
      if (!md.deliveryOption) errors.deliveryOption = "Delivery option required";
      if (!md.condition) errors.condition = "Condition required";
      break;

    case "Job Openings":
      if (!md.jobDescription) errors.jobDescription = "Job Description required";
      if (!md.jobType) errors.jobType = "Job Type required";
      if (!md.salary) errors.salary = "Salary required";
      if (!md.hours) errors.hours = "Hours required";
      if (!md.location) errors.location = "Location required";
      if (!md.qualifications) errors.qualifications = "Qualifications required";
      break;

    case "Rentals & Properties":
      if (!md.description) errors.description = "Description required";
      if (!md.sizeOrArea) errors.sizeOrArea = "Size / Area required";
      if (!md.rent) errors.rent = "Rent required";
      if (!md.amenities) errors.amenities = "Amenities required";
      if (!md.contact) errors.contact = "Contact required";
      if (!md.availableFrom) errors.availableFrom = "Available From date required";
      break;

    case "Announcements":
      if (!md.description) errors.description = "Description required";
      if (!md.announcementType) errors.announcementType = "Type required";
      if (!md.importanceLevel) errors.importanceLevel = "Importance Level required";
      break;

    case "Contests & Giveaways":
      if (!md.description) errors.description = "Description required";
      if (!md.participationRules) errors.participationRules = "Participation Rules required";
      if (!md.winnerAnnouncementDate) errors.winnerAnnouncementDate = "Winner Announcement Date required";
      if (!md.rules) errors.rules = "Rules required";
      if (!md.endDate) errors.endDate = "End Date required";
      if (!md.eligibility) errors.eligibility = "Eligibility required";
      if (!md.prize) errors.prize = "Prize required";
      break;

    default:
      // No extra validation if adType is not selected or unknown
      break;
  }

  return errors;
}
