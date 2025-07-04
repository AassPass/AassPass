import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { enumKeyToLabelMap } from "@/lib/utils"

export default function AdView({ selectedBusiness }) {
  if (!selectedBusiness) {
    return <p className="text-center text-gray-500">No business selected</p>
  }

  return (
    <ScrollArea className="h-full pr-2 overflow-x-hidden">
      <div className="space-y-6 overflow-x-hidden max-w-full">

        {/* Business Details */}
        <Card className="max-w-full overflow-x-hidden">
          <CardHeader>
            <DrawerTitle>{selectedBusiness.businessName}</DrawerTitle>
            <DrawerDescription>{enumKeyToLabelMap[selectedBusiness.businessType]}</DrawerDescription>
            <p><span className="text-sm bg-green-300 px-2 rounded-lg">{selectedBusiness.verificationStatus}</span></p>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><span className="font-medium">Phone:</span> {selectedBusiness.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {selectedBusiness.emailAddress}</p>
            <p><span className="font-medium">Address:</span> {selectedBusiness.address}</p>
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
                <Card key={ad.id} className="border shadow-sm max-w-full overflow-x-hidden p-2">
                    {ad.images?.length > 0 && (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                        <div className="flex w-max space-x-4 p-2">
                        {ad.images.map((img, index) => (
                            <img
                            key={index}
                            src={img.url}
                            alt={`Ad Image ${index + 1}`}
                            className="h-40 w-auto max-w-xs shrink-0 rounded-md object-cover"
                            />
                        ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    )}
                <CardHeader>
                  <CardTitle className="text-base">{ad.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{ad.category}</Badge>
                    <Badge variant="secondary">{ad.verificationStatus}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Visible:</span>{" "}
                    {new Date(ad.visibleFrom).toLocaleDateString()} → {new Date(ad.visibleTo).toLocaleDateString()}
                  </p>

                  {ad.metadata && (
                    <div className="space-y-1 text-gray-700">
                      <p><span className="font-medium">RSVP:</span> {ad.metadata.rsvp}</p>
                      <p><span className="font-medium">Time:</span> {ad.metadata.time}</p>
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
                  )}

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
