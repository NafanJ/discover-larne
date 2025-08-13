import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accessibility, Star, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Utility function to convert text to title case
const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

const ExploreListings = () => {
  const { data: businesses = [], isLoading, error } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Transform businesses data to match the expected listing format
  const listings = useMemo(() => {
    return businesses.map((b) => ({
      slug: b.id,
      name: b.name,
      category: toTitleCase(b.category || 'Business'),
      rating: b.rating,
      address: b.full_address,
      wheelchair: b.wheelchair_accessible,
      images: b.photo ? [b.photo] : ['/placeholder.svg'],
      description: b.description || '',
      contact: {
        phone: b.phone,
        website: b.site,
        address: b.full_address,
      },
    }));
  }, [businesses]);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(listings.map((l) => l.category))).filter(Boolean).sort(),
    [listings]
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    "relevance" | "rating_desc" | "rating_asc" | "name_asc" | "name_desc" | "category"
  >("relevance");

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      if (selectedCategories.length && !selectedCategories.includes(l.category))
        return false;
      if (wheelchairOnly && !l.wheelchair) return false;
      if ((l.rating ?? 0) < minRating) return false;
      return true;
    });
  }, [selectedCategories, wheelchairOnly, minRating]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "rating_desc":
        return arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "rating_asc":
        return arr.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
      case "name_asc":
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case "category":
        return arr.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return arr; // relevance = original order
    }
  }, [filtered, sortBy]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setWheelchairOnly(false);
    setMinRating(0);
    setSortBy("relevance");
  };

  const title = "Explore Listings in Larne";
  const description = "Browse all Larne listings with filters for category, rating, and accessibility.";
  const canonical =
    typeof window !== "undefined" ? `${window.location.origin}/explore/listings` : "/explore/listings";
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: canonical,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sorted.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/listings/${l.slug}`,
        name: l.name,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>Explore Listings | Discover Larne</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonical} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Use filters to narrow by category, accessibility, and rating. Sort to find the perfect spot.
          </p>
        </header>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3 mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open filters">Filters</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                <div>
                  <Label className="text-sm">Sort by</Label>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background border shadow-md">
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                      <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
                      <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                      <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Categories</Label>
                  <div className="mt-3 space-y-2">
                    {uniqueCategories.map((cat) => {
                      const checked = selectedCategories.includes(cat);
                      return (
                        <label key={cat} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) => {
                              setSelectedCategories((prev) =>
                                v ? [...prev, cat] : prev.filter((c) => c !== cat)
                              );
                            }}
                          />
                          <span>{toTitleCase(cat)}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Accessibility</Label>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={wheelchairOnly}
                        onCheckedChange={(v) => setWheelchairOnly(!!v)}
                      />
                      <span>Wheelchair accessible only</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Minimum rating: {minRating.toFixed(1)}</Label>
                  <div className="mt-3">
                    <Slider
                      max={5}
                      min={0}
                      step={0.5}
                      value={[minRating]}
                      onValueChange={(v) => setMinRating(v[0] ?? 0)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
                  <div className="text-xs text-muted-foreground ml-auto">
                    {sorted.length} result{sorted.length === 1 ? "" : "s"}
                  </div>
                </div>
                <SheetClose asChild>
                  <Button className="w-full" aria-label="Show results">Show results</Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Label className="text-sm">Sort</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="h-9 w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-background border shadow-md">
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
                <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {sorted.length} result{sorted.length === 1 ? "" : "s"}
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading listings. Please try again later.</p>
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid md:grid-cols-4 gap-8">
            {/* Filters */}
            <aside className="hidden md:block md:col-span-1">
            <div className="rounded-lg border p-4 space-y-6">
              <div>
                <Label className="text-sm">Sort by</Label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-background border shadow-md">
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                    <SelectItem value="rating_asc">Rating (Low to High)</SelectItem>
                    <SelectItem value="name_asc">Name (A to Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z to A)</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Categories</Label>
                <div className="mt-3 space-y-2">
                  {uniqueCategories.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label key={cat} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            setSelectedCategories((prev) =>
                              v ? [...prev, cat] : prev.filter((c) => c !== cat)
                            );
                          }}
                        />
                        <span>{toTitleCase(cat)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-sm">Accessibility</Label>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={wheelchairOnly}
                      onCheckedChange={(v) => setWheelchairOnly(!!v)}
                    />
                    <span>Wheelchair accessible only</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-sm">Minimum rating: {minRating.toFixed(1)}</Label>
                <div className="mt-3">
                  <Slider
                    max={5}
                    min={0}
                    step={0.5}
                    value={[minRating]}
                    onValueChange={(v) => setMinRating(v[0] ?? 0)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={clearFilters} aria-label="Clear filters">
                  Clear filters
                </Button>
                <div className="text-xs text-muted-foreground ml-auto">
                  {sorted.length} result{sorted.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="md:col-span-3">
            {sorted.length === 0 ? (
              <p className="text-muted-foreground">No listings match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.map((l) => (
                  <Link
                    key={l.slug}
                    to={`/listings/${l.slug}`}
                    className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`${l.name} details`}
                  >
                    <Card className="overflow-hidden group">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={l.images[0] || '/placeholder.svg'}
                          alt={`${l.name} listing photo`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <CardTitle className="text-base truncate">{l.name}</CardTitle>
                            {typeof l.rating === "number" && (
                              <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                                <Star className="h-4 w-4 text-primary" />
                                <span className="text-sm">{l.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-xs">{l.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="-mt-2">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex min-w-0 items-center gap-1">
                            <MapPin className="h-4 w-4 opacity-70" />
                            <span className="truncate">{l.address || 'No address available'}</span>
                          </div>
                          {l.wheelchair && (
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
            )}
          </div>
        </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ExploreListings;
