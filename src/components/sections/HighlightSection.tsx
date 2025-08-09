import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import portrait1 from "@/assets/larne/portrait-1.jpg";
import place1 from "@/assets/larne/place-1.jpg";
import portrait3 from "@/assets/larne/portrait-3.jpg";
import place2 from "@/assets/larne/place-2.jpg";

const items = [
  { title: "Meet Aoife", subtitle: "Local Café Owner", img: portrait3 },
  { title: "Coastal Cliffs", subtitle: "Causeway Route", img: place1 },
  { title: "Harbour Life", subtitle: "Boats at Dawn", img: place2 },
  { title: "Community Stories", subtitle: "People of Larne", img: portrait1 },
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
                alt={`${item.title} – Discover Larne`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground -mt-3">{item.subtitle}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HighlightSection;
