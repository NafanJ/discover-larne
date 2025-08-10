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

const Tile = ({ src, alt, label, className = "" }: { src: string; alt: string; label?: string; className?: string }) => (
  <div className={`relative overflow-hidden rounded-2xl shadow ${className}`}>
    <img
      src={src}
      alt={`${alt} – Discover Larne`}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
    />
    {label ? (
      <span className="absolute bottom-2 left-2 rounded-full bg-background/80 text-foreground text-xs px-2 py-1 shadow-sm border">
        {label}
      </span>
    ) : null}
  </div>
);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-center">
        <div className="space-y-6 animate-fade-in relative z-10">
          <div className="flex gap-3 flex-wrap">
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">120+ People</div>
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">300+ Stories</div>
            <div className="bg-secondary text-secondary-foreground rounded-full px-4 py-2">45+ Places</div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Discover Larne
          </h1>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            People & Places
          </h1>
          <p className="text-muted-foreground text-lg max-w-prose">
           on the Causeway Coastal Route.
          </p>

          <form onSubmit={onSearch} className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 bg-card border rounded-xl p-3 shadow-sm animate-scale-in">
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
            <Button type="submit" size="lg" className="rounded-lg sm:col-span-2">Search</Button>
          </form>
        </div>

        <div className="relative animate-slide-in-right lg:ml-8 xl:ml-16">
          <div className="rotate-0 lg:rotate-[12deg] origin-center [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
              {/* Column 1 */}
              <div className="flex flex-col gap-2 md:gap-3">
                <Tile src={portrait1} alt="Local resident portrait" className="h-24" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-28" label="The Black Arch" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-24" />
                <Tile src={place3} alt="Historic stone building" className="h-28" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-24" />
                <Tile src={place2} alt="Larne harbour scene" className="h-28" />
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-2 md:gap-3 mt-4">
                <Tile src={portrait4} alt="Artisan portrait" className="h-28" />
                <Tile src={place2} alt="Larne harbour scene" className="h-24" label="Chaine Memorial Tower" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-28" />
                <Tile src={portrait1} alt="Local resident portrait" className="h-24" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-28" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-24" />
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-2 md:gap-3 mt-8">
                <Tile src={place3} alt="Historic stone building" className="h-28" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-24" />
                <Tile src={portrait4} alt="Artisan portrait" className="h-28" />
                <Tile src={place2} alt="Larne harbour scene" className="h-24" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-28" />
                <Tile src={portrait1} alt="Local resident portrait" className="h-24" />
              </div>
              {/* Column 4 - shows from sm up */}
              <div className="hidden sm:flex flex-col gap-2 md:gap-3 mt-12">
                <Tile src={portrait2} alt="Fisherman portrait" className="h-24" />
                <Tile src={place3} alt="Historic stone building" className="h-28" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-24" />
                <Tile src={portrait4} alt="Artisan portrait" className="h-28" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-24" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-28" />
              </div>
              {/* Column 5 - shows from lg up */}
              <div className="hidden lg:flex flex-col gap-2 md:gap-3 mt-16">
                <Tile src={portrait1} alt="Local resident portrait" className="h-28" />
                <Tile src={place2} alt="Larne harbour scene" className="h-24" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-28" />
                <Tile src={place3} alt="Historic stone building" className="h-24" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-28" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-24" />
              </div>
              {/* Column 6 - shows from xl up */}
              <div className="hidden xl:flex flex-col gap-2 md:gap-3 mt-20">
                <Tile src={portrait4} alt="Artisan portrait" className="h-24" />
                <Tile src={place2} alt="Larne harbour scene" className="h-28" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-24" />
                <Tile src={portrait1} alt="Local resident portrait" className="h-28" />
                <Tile src={place3} alt="Historic stone building" className="h-24" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
