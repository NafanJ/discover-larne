import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import portrait1 from "@/assets/larne/portrait-1.jpg";
import portrait2 from "@/assets/larne/portrait-2.jpg";
import portrait3 from "@/assets/larne/portrait-3.jpg";
import portrait4 from "@/assets/larne/portrait-4.jpg";
import portrait5 from "@/assets/larne/portrait-5.jpg";
import place1 from "@/assets/larne/place-1.jpg";
import place2 from "@/assets/larne/place-2.jpg";
import place3 from "@/assets/larne/place-3.jpg";
const images = [{
  src: portrait1,
  alt: "Local resident portrait"
}, {
  src: place1,
  alt: "Causeway coastal cliffs"
}, {
  src: portrait2,
  alt: "Fisherman portrait"
}, {
  src: place2,
  alt: "Larne harbour scene"
}, {
  src: portrait3,
  alt: "Café owner portrait"
}, {
  src: place3,
  alt: "Historic stone building"
}, {
  src: portrait4,
  alt: "Artisan portrait"
}, {
  src: portrait5,
  alt: "Coastal hiker portrait"
}];
const Tile = ({
  src,
  alt,
  label,
  className = ""
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}) => <div className={`relative overflow-hidden rounded-xl transition-transform duration-200 ${className}`}>
    <img src={src} alt={`${alt} – Discover Larne`} loading="lazy" className="block w-full h-full object-cover transition-transform duration-200 hover:scale-105" />
    {label ? <span className="absolute bottom-2 left-2 rounded-full bg-background/80 text-foreground text-xs px-2 py-1 shadow-sm border">
        {label}
      </span> : null}
  </div>;
const Hero = () => {
  const {
    toast
  } = useToast();
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search coming soon",
      description: `Category: ${category} • Query: ${query}`
    });
  };
  return <section className="container min-h-[28vh] md:min-h-[32vh] lg:min-h-[40vh] pt-2 md:pt-4 lg:pt-6 pb-0 overflow-y-hidden overflow-x-visible">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 xl:gap-5 items-center">
        <div className="space-y-6 animate-fade-in relative z-10 self-center -mt-8 md:mt-0 lg:-mt-16">
            <div className="flex gap-3 flex-wrap" style={{ ["--stat-number" as any]: "213 88% 19%" }}>
              <div className="bg-transparent border border-border rounded-full px-4 py-2 text-foreground">
                <span className="font-semibold text-[hsl(var(--stat-number))]">18,853</span> People
              </div>
              <div className="bg-transparent border border-border rounded-full px-4 py-2 text-foreground">
                <span className="font-semibold text-[hsl(var(--stat-number))]">1000+</span> Stories
              </div>
            </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Discover Larne
          </h1>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#062c59]">
            People & Places
          </h1>
          <h5 className="text-1xl md:text-2xl lg:text-2xl font-bold leading-tight">
           on the Causeway Coastal Route
          </h5>

          <form onSubmit={onSearch} className="space-y-2 md:space-y-3 animate-scale-in">
            <div className="flex items-center md:gap-2 gap-1.5 bg-card border rounded-full px-2 md:px-3 py-0.5 md:py-1 shadow-sm">
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you looking for?" aria-label="What are you looking for?" className="flex-1 h-10 md:h-12 border-0 bg-transparent shadow-none px-2 md:px-3 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0" />
              <span className="h-5 md:h-6 w-px bg-border" aria-hidden="true" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-10 md:h-12 w-28 sm:w-32 md:w-44 border-0 bg-transparent shadow-none rounded-full px-2 md:px-3 text-xs sm:text-sm shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                  <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="people">People</SelectItem>
                  <SelectItem value="places">Places</SelectItem>
                  <SelectItem value="stories">Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" variant="brand" className="rounded-full h-10 md:h-12 px-5 md:px-6 text-sm md:text-base">
              Search
            </Button>
          </form>
        </div>

        <div className="relative w-full overflow-hidden animate-slide-in-right mx-0 px-0 hidden lg:block">
          <div className="rotate-0 lg:rotate-[12deg] origin-center [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 md:gap-4">
                <Tile src={portrait1} alt="Local resident portrait" className="h-36" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-[10.5rem]" label="The Black Arch" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-36" />
                <Tile src={place3} alt="Historic stone building" className="h-[10.5rem]" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-36" />
              </div>
              {/* Column 2 */}
              <div className="flex flex-col gap-3 md:gap-4 mt-4">
                <Tile src={portrait4} alt="Artisan portrait" className="h-[10.5rem]" />
                <Tile src={place2} alt="Larne harbour scene" className="h-36" label="Chaine Memorial Tower" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-[10.5rem]" />
                <Tile src={portrait1} alt="Local resident portrait" className="h-36" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-[10.5rem]" />
              </div>
              {/* Column 3 */}
              <div className="flex flex-col gap-3 md:gap-4">
                <Tile src={place3} alt="Historic stone building" className="h-[10.5rem]" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-36" />
                <Tile src={portrait4} alt="Artisan portrait" className="h-[10.5rem]" />
                <Tile src={place2} alt="Larne harbour scene" className="h-36" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-[10.5rem]" />
              </div>
              {/* Column 4 - shows from sm up */}
              <div className="hidden sm:flex flex-col gap-3 md:gap-4 mt-4">
                <Tile src={portrait2} alt="Fisherman portrait" className="h-36" />
                <Tile src={place3} alt="Historic stone building" className="h-[10.5rem]" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-36" />
                <Tile src={portrait4} alt="Artisan portrait" className="h-[10.5rem]" />
                <Tile src={place1} alt="Causeway coastal cliffs" className="h-36" />
              </div>
              {/* Column 5 - shows from lg up */}
              <div className="hidden lg:flex flex-col gap-3 md:gap-4">
                <Tile src={portrait1} alt="Local resident portrait" className="h-[10.5rem]" />
                <Tile src={place2} alt="Larne harbour scene" className="h-36" />
                <Tile src={portrait2} alt="Fisherman portrait" className="h-[10.5rem]" />
                <Tile src={place3} alt="Historic stone building" className="h-36" />
                <Tile src={portrait3} alt="Café owner portrait" className="h-[10.5rem]" />
              </div>
              {/* Column 6 - shows from xl up */}
              <div className="hidden xl:flex flex-col gap-3 md:gap-4 mt-4">
                <Tile src={portrait4} alt="Artisan portrait" className="h-36" />
                <Tile src={place2} alt="Larne harbour scene" className="h-[10.5rem]" />
                <Tile src={portrait5} alt="Coastal hiker portrait" className="h-36" />
                <Tile src={portrait1} alt="Local resident portrait" className="h-[10.5rem]" />
                <Tile src={place3} alt="Historic stone building" className="h-36" />
              </div>
            </div>
          </div>
          {/* Edge fades to softly clip overflow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent via-background/70 to-background" />
        </div>
      </div>
    </section>;
};
export default Hero;