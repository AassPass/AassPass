import {
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { enumKeyToLabelMap } from "@/lib/utils";

import Image from "next/image";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const renderMetadata = (ad) => {
  if (!ad?.metadata) return null;
  const { metadata } = ad;

  const Info = ({ label, value, fullWidth = false }) =>
    value ? (
      <p className={`text-sm text-gray-800 ${fullWidth ? "col-span-2" : ""}`}>
        <span className="font-semibold">{label}:</span>{" "}
        <span>{value}</span>
      </p>
    ) : null;

  const Link = ({ label, href, fullWidth = false }) =>
    href ? (
      <p className={`text-sm text-blue-600 underline break-words ${fullWidth ? "col-span-2" : ""}`}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </p>
    ) : null;

  const sections = {
    DEALS_DISCOUNTS: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Discount", value: `${metadata.discountPercentage}%` }),
      Info({ label: "Terms", value: metadata.terms, fullWidth: true }),
      Info({ label: "Valid Till", value: formatDate(metadata.validTill) }),
    ],
    EVENTS: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Organizer", value: metadata.organizerName }),
      Info({ label: "Time", value: metadata.time }),
      Info({ label: "RSVP", value: metadata.rsvp }),
      Link({ label: "Location", href: metadata.location, fullWidth: true }),
    ],
    SERVICES: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Service Type", value: metadata.serviceType }),
      Info({ label: "Contact", value: metadata.contact }),
      Info({ label: "Radius", value: `${metadata.radius} km` }),
    ],
    PRODUCTS_FOR_SALE: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Price", value: `₹${metadata.price}` }),
      Info({ label: "Available", value: metadata.quantityAvailable }),
      Info({ label: "Delivery", value: metadata.deliveryOption }),
      Info({ label: "Condition", value: metadata.condition }),
    ],
    JOB_OPENINGS: [
      Info({ label: "Job Description", value: metadata.jobDescription, fullWidth: true }),
      Info({ label: "Type", value: metadata.jobType }),
      Info({ label: "Salary", value: metadata.salary }),
      Info({ label: "Hours", value: metadata.hours }),
      Info({ label: "Location", value: metadata.location }),
      Info({ label: "Qualifications", value: metadata.qualifications }),
    ],
    RENTALS_PROPERTIES: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Size/Area", value: metadata.sizeOrArea }),
      Info({ label: "Rent", value: `₹${metadata.rent}` }),
      Info({ label: "Available From", value: metadata.availableFrom }),
      Info({ label: "Amenities", value: metadata.amenities }),
      Info({ label: "Contact", value: metadata.contact }),
    ],
    ANNOUNCEMENTS: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Type", value: metadata.announcementType }),
      Info({ label: "Importance", value: metadata.importanceLevel }),
    ],
    CONTESTS_GIVEAWAYS: [
      Info({ label: "Description", value: metadata.description, fullWidth: true }),
      Info({ label: "Prize", value: metadata.prize }),
      Info({ label: "Eligibility", value: metadata.eligibility }),
      Info({ label: "End Date", value: metadata.endDate }),
      Info({ label: "Rules", value: metadata.rules, fullWidth: true }),
      Info({ label: "Winner Announcement", value: metadata.winnerAnnouncementDate }),
      Info({ label: "Participation", value: metadata.participationRules }),
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
      {sections[ad.category]}
    </div>
  );
};



export default function AdView({ selectedBusiness }) {
  if (!selectedBusiness) {
    return <p className="text-center text-gray-400">No business selected.</p>;
  }
console.log(selectedBusiness)
  return (
    <div className="">
      {/* Business Info Card */}
     <div className="w-full font-sans antialiased">

      {/* Banner Section */}
      <div className="relative w-full h-24 bg-gray-200">
        <img
          src={
            selectedBusiness.coverImage ||
            "https://placehold.co/800x240/808080/FFFFFF?text=Business+Banner"
          }
          alt="Business Banner"
          layout="fill"
         
          
        />
      </div>

      {/* Logo Overlay */}
      <div className="relative px-4">
        <div className="absolute -top-12 left-4 w-24 h-24 rounded-full border-4 border-white shadow-md bg-white">
          <img
            src={
              selectedBusiness.logo ||
              "https://placehold.co/96x96/3B82F6/FFFFFF?text=B"
            }
            alt="Business Logo"
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="pt-14 pb-4 px-4 space-y-1 text-left flex gap-2 flex-col">
        <div className="flex gap-2" >

        <h1 className="text-sm font-bold text-gray-900">
          {selectedBusiness.businessName}
        </h1>
        <p className="text-[10px] text-gray-600">
          {selectedBusiness.businessType}
        </p>
        <p className="text-[10px] text-gray-500">
          📞 {selectedBusiness.phoneNumber || "No phone number"}
        </p>
        </div>
        <div className="flex justify-between">
          
        <p className="text-sm text-gray-500">
          📧 {selectedBusiness.emailAddress || "No email"}
        </p>
  {selectedBusiness.websiteLink && (
          <a
            href={`https://${selectedBusiness.websiteLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className=" text-sm underline break-words block mt-1"
          >
            website
          </a>
        )}
        </div>
        <p className="text-sm text-gray-500">
          📍 {selectedBusiness.address || "No address"}
        </p>

      

        {/* Verification Status */}
      {selectedBusiness.verificationStatus === "VERIFIED" && (
              <div className="flex w-fit items-center gap-2 bg-green-100 text-green-700 px-1 md:px-4 md:py-2 font-semibold text-sm sm:text-base shadow-sm">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-[12px]">Verified</span>
              </div>
            )}
      </div>
    </div>



      {/* Ads Section */}
      {selectedBusiness.ads?.length > 0 && (
        <div className="space-y-4 p-2">
          <h3 className="text-md text-center font-semibold text-black">See What we offer</h3>
          
          {selectedBusiness.ads.map((ad) => (
            <Card key={ad.id} className="space-y-2 p-2">
              {/* Images */}
            {ad.images?.length > 0 && (
  <div className="grid grid-cols-2 gap-2">
    {/* Banner (aspect ratio 4:1) */}
    {ad.images.find((img) => img.type === "BANNER") && (
      <div
        className="col-span-2 relative overflow-hidden rounded-lg shadow-md border"
        style={{ aspectRatio: "4 / 1" }}
      >
        <Image
          src={ad.images.find((img) => img.type === "BANNER").url}
          alt="Banner"
          fill
          className="object-cover w-full h-full "
        />
      </div>
    )}

    {/* Normal Images (aspect ratio 3:2) */}
    {ad.images
      .filter((img) => img.type === "NORMAL")
      .slice(0, 2)
      .map((img) => (
        <div
          key={img.id}
          className="relative overflow-hidden rounded-lg shadow-md border"
          style={{ aspectRatio: "3 / 2" }}
        >
          <Image
            src={img.url}
            alt="Ad Image"
            fill
            className="object-cover w-full h-full rounded-md"
          />
        </div>
      ))}
  </div>
)}


              {/* Ad Info */}
              <CardHeader className='flex gap-2  p-0' >
                <CardTitle className="text-md">{ad.title}</CardTitle>
                <div className="flex flex-wrap gap-2 text-[10px] ">
                  <Badge variant="outline" className="text-[8px]" >{ad.category}</Badge>
                
                </div>
              </CardHeader>
              <CardContent className=" p-0 text-sm">
               
                {renderMetadata(ad)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
