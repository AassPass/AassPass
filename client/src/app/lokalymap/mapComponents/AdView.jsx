import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { enumKeyToLabelMap } from "@/lib/utils";
import Image from "next/image";

const renderMetadata = (ad) => {
  if (!ad?.metadata) return null;
  switch (ad.category) {
    case "DEALS_DISCOUNTS":
      return (
        <div className="space-y-1 text-gray-900">
          <p>
            <span className="font-medium"></span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Discount:</span>{" "}
            {ad.metadata.discountPercentage}%
          </p>
          <p>
            <span className="font-medium">Terms:</span> {ad.metadata.terms}
          </p>
          <p>
            <span className="font-medium">Valid Till:</span>{" "}
            {ad.metadata.validTill}
          </p>
        </div>
      );

    case "EVENTS":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Organizer:</span>{" "}
            {ad.metadata.organizerName}
          </p>
          <p>
            <span className="font-medium">Time:</span> {ad.metadata.time}
          </p>
          <p>
            <span className="font-medium">RSVP:</span> {ad.metadata.rsvp}
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            <a
              href={ad.metadata.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              Map
            </a>
          </p>
        </div>
      );

    case "SERVICES":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Service Type:</span>{" "}
            {ad.metadata.serviceType}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {ad.metadata.contact}
          </p>
          <p>
            <span className="font-medium">Radius:</span> {ad.metadata.radius} km
          </p>
        </div>
      );

    case "PRODUCTS_FOR_SALE":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Price:</span> ₹{ad.metadata.price}
          </p>
          <p>
            <span className="font-medium">Quantity Available:</span>{" "}
            {ad.metadata.quantityAvailable}
          </p>
          <p>
            <span className="font-medium">Delivery:</span>{" "}
            {ad.metadata.deliveryOption}
          </p>
          <p>
            <span className="font-medium">Condition:</span>{" "}
            {ad.metadata.condition}
          </p>
        </div>
      );

    case "JOB_OPENINGS":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Job Description:</span>{" "}
            {ad.metadata.jobDescription}
          </p>
          <p>
            <span className="font-medium">Job Type:</span> {ad.metadata.jobType}
          </p>
          <p>
            <span className="font-medium">Salary:</span> {ad.metadata.salary}
          </p>
          <p>
            <span className="font-medium">Hours:</span> {ad.metadata.hours}
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            {ad.metadata.location}
          </p>
          <p>
            <span className="font-medium">Qualifications:</span>{" "}
            {ad.metadata.qualifications}
          </p>
        </div>
      );

    case "RENTALS_PROPERTIES":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Size/Area:</span>{" "}
            {ad.metadata.sizeOrArea}
          </p>
          <p>
            <span className="font-medium">Rent:</span> ₹{ad.metadata.rent}
          </p>
          <p>
            <span className="font-medium">Available From:</span>{" "}
            {ad.metadata.availableFrom}
          </p>
          <p>
            <span className="font-medium">Amenities:</span>{" "}
            {ad.metadata.amenities}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {ad.metadata.contact}
          </p>
        </div>
      );

    case "ANNOUNCEMENTS":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Type:</span>{" "}
            {ad.metadata.announcementType}
          </p>
          <p>
            <span className="font-medium">Importance:</span>{" "}
            {ad.metadata.importanceLevel}
          </p>
        </div>
      );

    case "CONTESTS_GIVEAWAYS":
      return (
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Description:</span>{" "}
            {ad.metadata.description}
          </p>
          <p>
            <span className="font-medium">Prize:</span> {ad.metadata.prize}
          </p>
          <p>
            <span className="font-medium">Eligibility:</span>{" "}
            {ad.metadata.eligibility}
          </p>
          <p>
            <span className="font-medium">End Date:</span> {ad.metadata.endDate}
          </p>
          <p>
            <span className="font-medium">Rules:</span> {ad.metadata.rules}
          </p>
          <p>
            <span className="font-medium">Winner Announcement:</span>{" "}
            {ad.metadata.winnerAnnouncementDate}
          </p>
          <p>
            <span className="font-medium">Participation:</span>{" "}
            {ad.metadata.participationRules}
          </p>
        </div>
      );

    default:
      return null;
  }
};

export default function AdView({ selectedBusiness }) {
  if (!selectedBusiness) {
    return <p className="text-center text-gray-500">No business selected</p>;
  }
  return (
    <div className="pr-2 overflow-x-hidden space-y-6 pb-10">
      <div className="space-y-6 overflow-x-hidden max-w-full">
        {/* Business Details */}
        <Card className="max-w-full overflow-x-hidden">
          <CardHeader>
            <DrawerTitle>{selectedBusiness.businessName}</DrawerTitle>
            <DrawerDescription>
              {enumKeyToLabelMap[selectedBusiness.businessType]}
            </DrawerDescription>
            <p>
              <span className="text-sm bg-green-300 px-2 rounded-lg">
                {selectedBusiness.verificationStatus}
              </span>
            </p>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {selectedBusiness.phoneNumber}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {selectedBusiness.emailAddress}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {selectedBusiness.address}
            </p>
            <p>
              <span className="font-medium">Website:</span>{" "}
              <a
                href={`https://${selectedBusiness.websiteLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {selectedBusiness.websiteLink}
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Ads Section */}
        {selectedBusiness.ads?.length > 0 && (
          <div className="space-y-4 max-w-full">
            <h3 className="text-lg font-semibold text-white">Published Ads</h3>
            <Separator />
            {selectedBusiness.ads.map((ad) => (
              <Card
                key={ad.id}
                className="border shadow-sm max-w-full overflow-x-hidden p-2"
              >
                {/* Render Images */}
                {ad.images?.length > 0 && (
                  <div className="space-y-2">
                    {/* Banner Image */}
                    {ad.images.find((img) => img.type === "BANNER") && (
                      <div className="w-full rounded-md overflow-hidden">
                        <Image
                          src={
                            ad.images.find((img) => img.type === "BANNER").url
                          }
                          alt="Banner"
                          width={1200}
                          height={600}
                          className="w-full h-auto object-cover rounded-md"
                        />
                      </div>
                    )}

                    {/* Normal Images */}
                    {(() => {
                      const normals = ad.images.filter(
                        (img) => img.type === "NORMAL"
                      );
                      if (normals.length === 0) return null;
                      return (
                        <div
                          className={`grid gap-2 ${
                            normals.length === 2 ? "grid-cols-2" : "grid-cols-1"
                          }`}
                        >
                          {normals.map((img) => (
                            <div
                              key={img.id}
                              className="rounded-md overflow-hidden"
                            >
                              <Image
                                src={img.url}
                                alt="Normal"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover rounded-md"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-base text-md">
                    {ad.title}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{ad.category}</Badge>
                    <Badge variant="secondary">{ad.verificationStatus}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Visible:</span>{" "}
                    {new Date(ad.visibleFrom).toLocaleDateString()} →{" "}
                    {new Date(ad.visibleTo).toLocaleDateString()}
                  </p>

                  {renderMetadata(ad)}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
