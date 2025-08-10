import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Accessibility } from "lucide-react";
import portrait1 from "@/assets/larne/portrait-1.jpg";
import place1 from "@/assets/larne/place-1.jpg";
import portrait3 from "@/assets/larne/portrait-3.jpg";
import place2 from "@/assets/larne/place-2.jpg";

// Minimal, relevant business fields for highlights
const items = [
  {
    name: "Meet Connor",
    category: "Café",
    rating: 4.6,
    address: "Harbour Rd",
    wheelchair: true,
    img: portrait3,
  },
  {
    name: "Coastal Cliffs",
    category: "Attraction",
    rating: 4.8,
    address: "Causeway Route",
    wheelchair: false,
    img: place1,
  },
  {
    name: "Harbour Life",
    category: "Scenic Spot",
    rating: 4.5,
    address: "Larne Harbour",
    wheelchair: true,
    img: place2,
  },
  {
    name: "Community Stories",
    category: "People",
    rating: 4.7,
    address: "Town Centre",
    wheelchair: true,
    img: portrait1,
  },
  // Duplicates to fill grid (can later be replaced with real data)
  {
    name: "Coastal Cliffs",
    category: "Attraction",
    rating: 4.8,
    address: "Causeway Route",
    wheelchair: false,
    img: place1,
  },
  {
    name: "Meet Connor",
    category: "Café",
    rating: 4.6,
    address: "Harbour Rd",
    wheelchair: true,
    img: portrait3,
  },
  {
    name: "Community Stories",
    category: "People",
    rating: 4.7,
    address: "Town Centre",
    wheelchair: true,
    img: portrait1,
  },
  {
    name: "Harbour Life",
    category: "Scenic Spot",
    rating: 4.5,
    address: "Larne Harbour",
    wheelchair: true,
    img: place2,
  },
];

const HighlightSection = () => {
  return (
    <section className="container py-8 md:py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured People & Places</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <Card key={idx} className="overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={item.img}
                alt={`${item.name} – ${item.category} in Larne`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base truncate">{item.name}</CardTitle>
                <Badge variant="secondary" className="shrink-0 text-xs">{item.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="-mt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span>{item.rating.toFixed(1)}</span>
                </div>
                <span className="h-1 w-1 rounded-full bg-border" />
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
        ))}
      </div>
    </section>
  );
};

export default HighlightSection;
