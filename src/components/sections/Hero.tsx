import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import portrait1 from "@/assets/larne/portrait-1.jpg";
import portrait2 from "@/assets/larne/portrait-2.jpg";
import portrait3 from "@/assets/larne/portrait-3.jpg";
import portrait4 from "@/assets/larne/portrait-4.jpg";
import portrait5 from "@/assets/larne/portrait-5.jpg";
import place1 from "@/assets/larne/place-1.jpg";
import place2 from "@/assets/larne/place-2.jpg";
import place3 from "@/assets/larne/place-3.jpg";

const images = [
  { src: portrait1, alt: "Local resident portrait" },
  { src: place1, alt: "Causeway coastal cliffs" },
  { src: portrait2, alt: "Fisherman portrait" },
  { src: place2, alt: "Larne harbour scene" },
  { src: portrait3, alt: "Café owner portrait" },
  { src: place3, alt: "Historic stone building" },
  { src: portrait4, alt: "Artisan portrait" },
  { src: portrait5, alt: "Coastal hiker portrait" },
];

const Hero = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Search coming soon", description: `Category: ${category} • Query: ${query}` });
  };

  return (
    <section className="container py-12 md:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Discover Larne – People & Places on the Causeway Coastal Route
          </h1>
          <p className="text-muted-foreground text-lg max-w-prose">
            Explore the stories of local people and the beautiful locations that make Larne special.
          </p>

          <div className="flex gap-3 flex-wrap">
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">120+ People</div>
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">300+ Stories</div>
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">45+ Places</div>
          </div>

          <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-3 bg-card border rounded-xl p-3 shadow-sm animate-scale-in">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="people">People</SelectItem>
                <SelectItem value="places">Places</SelectItem>
                <SelectItem value="stories">Stories</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, places or stories"
              className="rounded-lg"
              aria-label="Search people, places or stories"
            />
            <Button type="submit" size="lg" className="rounded-lg">Search</Button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-4 lg:gap-5 animate-slide-in-right">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`overflow-hidden rounded-2xl shadow ${idx % 7 === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img
                src={img.src}
                alt={`${img.alt} – Discover Larne`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
