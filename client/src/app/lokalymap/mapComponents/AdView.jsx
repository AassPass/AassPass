import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { enumKeyToLabelMap } from "@/lib/utils";

import Image from "next/image";
import React from "react";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
const Info = ({ label, value, fullWidth = false }) =>
  value ? (
    <p className={`text-sm text-gray-800 ${fullWidth ? "col-span-2" : ""}`}>
      <span className="font-semibold">{label}:</span> <span>{value}</span>
    </p>
  ) : null;

const Link = ({ label, href, fullWidth = false }) =>
  href ? (
    <p
      className={`text-sm text-blue-600 underline break-words ${
        fullWidth ? "col-span-2" : ""
      }`}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </p>
  ) : null;
const renderMetadata = (ad) => {
  if (!ad?.metadata) return null;

  const { metadata, category } = ad;
  const entries = [];

  switch (category) {
    case "DEALS_DISCOUNTS":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "discount",
          node: (
            <Info label="Discount" value={`${metadata.discountPercentage}%`} />
          ),
        },
        {
          key: "terms",
          node: <Info label="Terms" value={metadata.terms} fullWidth />,
        },
        {
          key: "validTill",
          node: (
            <Info label="Valid Till" value={formatDate(metadata.validTill)} />
          ),
        }
      );
      break;
    case "EVENTS":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "organizer",
          node: <Info label="Organizer" value={metadata.organizerName} />,
        },
        { key: "time", node: <Info label="Time" value={metadata.time} /> },
        { key: "rsvp", node: <Info label="RSVP" value={metadata.rsvp} /> },
        {
          key: "location",
          node: <Link label="Location" href={metadata.location} fullWidth />,
        }
      );
      break;
    case "SERVICES":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "serviceType",
          node: <Info label="Service Type" value={metadata.serviceType} />,
        },
        {
          key: "contact",
          node: <Info label="Contact" value={metadata.contact} />,
        },
        {
          key: "radius",
          node: <Info label="Radius" value={`${metadata.radius} km`} />,
        }
      );
      break;
    case "PRODUCTS_FOR_SALE":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "price",
          node: <Info label="Price" value={`₹${metadata.price}`} />,
        },
        {
          key: "available",
          node: <Info label="Available" value={metadata.quantityAvailable} />,
        },
        {
          key: "delivery",
          node: <Info label="Delivery" value={metadata.deliveryOption} />,
        },
        {
          key: "condition",
          node: <Info label="Condition" value={metadata.condition} />,
        }
      );
      break;
    case "JOB_OPENINGS":
      entries.push(
        {
          key: "jobDesc",
          node: (
            <Info
              label="Job Description"
              value={metadata.jobDescription}
              fullWidth
            />
          ),
        },
        {
          key: "jobType",
          node: <Info label="Type" value={metadata.jobType} />,
        },
        {
          key: "salary",
          node: <Info label="Salary" value={metadata.salary} />,
        },
        { key: "hours", node: <Info label="Hours" value={metadata.hours} /> },
        {
          key: "location",
          node: <Info label="Location" value={metadata.location} />,
        },
        {
          key: "qualifications",
          node: <Info label="Qualifications" value={metadata.qualifications} />,
        }
      );
      break;
    case "RENTALS_PROPERTIES":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "size",
          node: <Info label="Size/Area" value={metadata.sizeOrArea} />,
        },
        {
          key: "rent",
          node: <Info label="Rent" value={`₹${metadata.rent}`} />,
        },
        {
          key: "availableFrom",
          node: <Info label="Available From" value={metadata.availableFrom} />,
        },
        {
          key: "amenities",
          node: <Info label="Amenities" value={metadata.amenities} />,
        },
        {
          key: "contact",
          node: <Info label="Contact" value={metadata.contact} />,
        }
      );
      break;
    case "ANNOUNCEMENTS":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        {
          key: "type",
          node: <Info label="Type" value={metadata.announcementType} />,
        },
        {
          key: "importance",
          node: <Info label="Importance" value={metadata.importanceLevel} />,
        }
      );
      break;
    case "CONTESTS_GIVEAWAYS":
      entries.push(
        {
          key: "description",
          node: (
            <Info label="Description" value={metadata.description} fullWidth />
          ),
        },
        { key: "prize", node: <Info label="Prize" value={metadata.prize} /> },
        {
          key: "eligibility",
          node: <Info label="Eligibility" value={metadata.eligibility} />,
        },
        {
          key: "endDate",
          node: <Info label="End Date" value={metadata.endDate} />,
        },
        {
          key: "rules",
          node: <Info label="Rules" value={metadata.rules} fullWidth />,
        },
        {
          key: "winnerAnnouncement",
          node: (
            <Info
              label="Winner Announcement"
              value={metadata.winnerAnnouncementDate}
            />
          ),
        },
        {
          key: "participation",
          node: (
            <Info label="Participation" value={metadata.participationRules} />
          ),
        }
      );
      break;
    default:
      return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 text-gray-800 text-sm">
      {entries.map(({ key, node }) => (
        <React.Fragment key={key}>{node}</React.Fragment>
      ))}
    </div>
  );
};

export default function AdView({ selectedBusiness }) {
  if (!selectedBusiness) {
    return <p className="text-center text-gray-400">No business selected.</p>;
  }

  return (
    <div className="">
      {/* Business Info Card */}
      <div className="w-full font-sans antialiased">
        {/* Banner Section */}
        <div className="relative w-full h-24 bg-gray-200 overflow-hidden">
          <img
            src={
              selectedBusiness.owner.bannerPicture ||
              "https://placehold.co/800x240/808080/FFFFFF?text=Business+Banner"
            }
            alt="Business Banner"
            layout="fill"
          />
        </div>

        {/* Logo Overlay */}
        <div className="relative px-4">
          <div className="absolute -top-12 left-4 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
            <img
              src={
                selectedBusiness.owner.profilePicture ||
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
          <div className="flex gap-2">
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
          <h3 className="text-md text-center font-semibold text-black">
            See What we offer
          </h3>

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
              <CardHeader className="flex gap-2  p-0">
                <CardTitle className="text-md">{ad.title}</CardTitle>
                <div className="flex flex-wrap gap-2 text-[10px] ">
                  <Badge variant="outline" className="text-[8px]">
                    {ad.category}
                  </Badge>
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
