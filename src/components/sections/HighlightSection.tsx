import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Accessibility } from "lucide-react";
import { Link } from "react-router-dom";
import { BusinessTileImage } from "@/components/business/BusinessImageDisplay";

// Minimal, relevant business fields for highlights
const items = [
  {
    name: "Chaine Memorial Tower",
    category: "Landmark",
    rating: 4.7,
    address: "Larne Harbour",
    wheelchair: true,
    img: "/lovable-uploads/11c67c4c-f7fb-4290-8f45-874ba43b85f9.png",
  },
  {
    name: "Mourne Mountains View",
    category: "Viewpoint",
    rating: 4.8,
    address: "County Down",
    wheelchair: false,
    img: "/lovable-uploads/774caacf-4765-4d50-8206-83c474f64e99.png",
  },
  {
    name: "Winter Village Aerial",
    category: "Scenic",
    rating: 4.5,
    address: "Countryside",
    wheelchair: false,
    img: "/lovable-uploads/5c56be04-d2ae-485e-bcd3-c8337a1d7106.png",
  },
  {
    name: "Antrim Coast Road",
    category: "Coastal Route",
    rating: 4.9,
    address: "Causeway Coastal",
    wheelchair: true,
    img: "/lovable-uploads/27f10492-eea7-426f-92aa-2830b4f34ab7.png",
  },
];

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const HighlightSection = () => {
  return (
    <section className="container pt-0 pb-6">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured People & Places</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={`/listings/${slugify(item.name)}`}
            className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={`${item.name} details`}
          >
            <Card className="overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <BusinessTileImage 
                  businessId={slugify(item.name)} 
                  fallbackSrc={item.img}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <CardTitle className="text-base truncate">{item.name}</CardTitle>
                    <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">{item.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="-mt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex min-w-0 items-center gap-1">
                    <MapPin className="h-4 w-4 opacity-70" />
                    <span className="truncate">{item.address}</span>
                  </div>
                  {item.wheelchair && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <Badge variant="outline" className="gap-1">
                        <Accessibility className="h-3.5 w-3.5" />
                        Accessible
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HighlightSection;
