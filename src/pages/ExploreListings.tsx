import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useMemo, useState, useCallback, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accessibility, Star, MapPin, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListingsGridSkeleton } from "@/components/ui/loading-skeleton";
import { useOptimizedImage } from "@/hooks/use-optimized-image";
import { categoryGroups, getGroupForCategory, getGroupInfo } from "@/data/categoryGroups";
import { BusinessTileImage } from "@/components/business/BusinessImageDisplay";

// Utility function to convert text to title case (memoized)
const toTitleCase = (() => {
  const cache = new Map<string, string>();
  return (str: string): string => {
    if (cache.has(str)) return cache.get(str)!;
    const result = str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    cache.set(str, result);
    return result;
  };
})();

// Optimized image component
const OptimizedImage = memo(({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const {
    imageSrc,
    isLoading
  } = useOptimizedImage({
    src
  });
  return <div className="relative">
      <img src={imageSrc} alt={alt} loading="lazy" className={className} style={{
      opacity: isLoading ? 0.7 : 1,
      transition: 'opacity 0.3s'
    }} />
      {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
    </div>;
});
OptimizedImage.displayName = "OptimizedImage";
const ITEMS_PER_PAGE = 24;
const ExploreListings = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: businesses = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('businesses').select('id, name, category, rating, full_address, wheelchair_accessible, photo').order('name');
      if (error) throw error;
      return data || [];
    }
  });

  // Transform businesses data to match the expected listing format (optimized)
  const listings = useMemo(() => {
    return businesses.map(b => ({
      id: b.id,
      slug: b.id,
      name: b.name,
      category: toTitleCase(b.category || 'Business'),
      rating: b.rating,
      address: b.full_address,
      wheelchair: b.wheelchair_accessible,
      image: b.photo || '/placeholder.svg'
    }));
  }, [businesses]);

  // Get unique category groups instead of individual categories
  const uniqueCategoryGroups = useMemo(() => {
    const groups = new Set<string>();
    listings.forEach(listing => {
      const groupId = getGroupForCategory(listing.category);
      if (groupId) {
        groups.add(groupId);
      }
    });
    // Sort alphabetically but keep "Other Services" at the bottom
    const groupsArray = Array.from(groups);
    const orderedGroups = categoryGroups.filter(group => groupsArray.includes(group.id)).sort((a, b) => {
      // Keep "Other Services" at the bottom
      if (a.id === 'other-services') return 1;
      if (b.id === 'other-services') return -1;
      // Sort others alphabetically
      return a.name.localeCompare(b.name);
    }).map(group => ({
      id: group.id,
      info: group
    }));
    return orderedGroups;
  }, [listings]);
  const [selectedCategoryGroups, setSelectedCategoryGroups] = useState<string[]>([]);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"relevance" | "rating_desc" | "rating_asc" | "name_asc" | "name_desc" | "category">("relevance");
  const filtered = useMemo(() => {
    return listings.filter(l => {
      // Search functionality - check name, category, and address
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = l.name.toLowerCase().includes(searchLower) || l.category.toLowerCase().includes(searchLower) || l.address && l.address.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filter by category groups
      if (selectedCategoryGroups.length) {
        const categoryGroup = getGroupForCategory(l.category);
        if (!categoryGroup || !selectedCategoryGroups.includes(categoryGroup)) {
          return false;
        }
      }
      if (wheelchairOnly && !l.wheelchair) return false;
      if ((l.rating ?? 0) < minRating) return false;
      return true;
    });
  }, [listings, searchQuery, selectedCategoryGroups, wheelchairOnly, minRating]);
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
        return arr;
      // relevance = original order
    }
  }, [filtered, sortBy]);

  // Pagination logic
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = sorted.slice(startIndex, endIndex);
  const clearFilters = useCallback(() => {
    setSelectedCategoryGroups([]);
    setWheelchairOnly(false);
    setMinRating(0);
    setSortBy("relevance");
    setCurrentPage(1);
  }, []);

  // Reset page when filters change
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedCategoryGroups, wheelchairOnly, minRating, sortBy]);
  const title = "Explore Listings in Larne";
  const description = "Browse all Larne listings with filters for category, rating, and accessibility.";
  const canonical = typeof window !== "undefined" ? `${window.location.origin}/explore/listings` : "/explore/listings";
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
        name: l.name
      }))
    }
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>Explore Listings | Discover Larne</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={canonical} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {searchQuery ? `Search results for "${searchQuery}"` : title}
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {searchQuery ? `Found ${sorted.length} result${sorted.length === 1 ? '' : 's'} matching your search.` : 'Use filters to narrow by category, accessibility, and rating. Sort to find the perfect spot.'}
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
                  <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
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
                    {uniqueCategoryGroups.map(({
                    id,
                    info
                  }) => {
                    const checked = selectedCategoryGroups.includes(id);
                    return <label key={id} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={checked} onCheckedChange={v => {
                        setSelectedCategoryGroups(prev => v ? [...prev, id] : prev.filter(c => c !== id));
                      }} />
                          <span>{info.name}</span>
                        </label>;
                  })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Accessibility</Label>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox checked={wheelchairOnly} onCheckedChange={v => setWheelchairOnly(!!v)} />
                      <span>Wheelchair accessible only</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Minimum rating: {minRating.toFixed(1)}</Label>
                  <div className="mt-3">
                    <Slider max={5} min={0} step={0.5} value={[minRating]} onValueChange={v => setMinRating(v[0] ?? 0)} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>
                   <div className="text-xs text-muted-foreground ml-auto">
                     {totalItems} result{totalItems === 1 ? "" : "s"}
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
            <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
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
           
        </div>

        {isLoading && <section className="grid md:grid-cols-4 gap-8">
            <aside className="hidden md:block md:col-span-1">
              <div className="rounded-lg border p-4 space-y-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-10 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="space-y-2">
                    {Array.from({
                  length: 5
                }).map((_, i) => <div key={i} className="h-4 bg-muted animate-pulse rounded" />)}
                  </div>
                </div>
              </div>
            </aside>
            <div className="md:col-span-3">
              <ListingsGridSkeleton count={12} />
            </div>
          </section>}

        {error && <div className="text-center py-8">
            <p className="text-destructive">Error loading listings. Please try again later.</p>
          </div>}

        {!isLoading && !error && <section className="grid md:grid-cols-4 gap-8">
            {/* Filters */}
            <aside className="hidden md:block md:col-span-1">
            <div className="rounded-lg border p-4 space-y-6">
              <div>
                <Label className="text-sm">Sort by</Label>
                <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
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
                  {uniqueCategoryGroups.map(({
                  id,
                  info
                }) => {
                  const checked = selectedCategoryGroups.includes(id);
                  return <label key={id} className="flex items-center gap-2 text-sm">
                        <Checkbox checked={checked} onCheckedChange={v => {
                      setSelectedCategoryGroups(prev => v ? [...prev, id] : prev.filter(c => c !== id));
                    }} />
                        <span>{info.name}</span>
                      </label>;
                })}
                </div>
              </div>

              <div>
                <Label className="text-sm">Accessibility</Label>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={wheelchairOnly} onCheckedChange={v => setWheelchairOnly(!!v)} />
                    <span>Wheelchair accessible only</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="text-sm">Minimum rating: {minRating.toFixed(1)}</Label>
                <div className="mt-3">
                  <Slider max={5} min={0} step={0.5} value={[minRating]} onValueChange={v => setMinRating(v[0] ?? 0)} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={clearFilters} aria-label="Clear filters">
                  Clear filters
                </Button>
                 <div className="text-xs text-muted-foreground ml-auto">
                   {totalItems} result{totalItems === 1 ? "" : "s"}
                 </div>
              </div>
            </div>
          </aside>

           {/* Results */}
           <div className="md:col-span-3">
             {totalItems === 0 ? <p className="text-muted-foreground">No listings match your filters.</p> : <>
                 <div className="flex items-center justify-between mb-4">
                   <p className="text-sm text-muted-foreground">
                     Showing {startIndex + 1}-{endIndex} of {totalItems} results
                   </p>
                   {totalPages > 1}
                 </div>
                 
                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                     {currentItems.map(l => <ListingCard key={l.slug} listing={l} />)}
                   </div>

                  {totalPages > 1 && <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8">
                      <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-2 sm:px-4 text-sm">
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {Array.from({
                   length: Math.min(5, totalPages)
                 }, (_, i) => {
                   let pageNum;
                   if (totalPages <= 5) {
                     pageNum = i + 1;
                   } else if (currentPage <= 3) {
                     pageNum = i + 1;
                   } else if (currentPage >= totalPages - 2) {
                     pageNum = totalPages - 4 + i;
                   } else {
                     pageNum = currentPage - 2 + i;
                   }
                   return <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(pageNum)} className="w-8 h-8 sm:w-10 sm:h-10 text-sm">
                             {pageNum}
                           </Button>;
                 })}
                      </div>

                      <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-2 sm:px-4 text-sm">
                        Next
                      </Button>
                    </div>}
               </>}
           </div>
        </section>}
      </main>
      <Footer />
    </div>;
};

// Memoized listing card component for better performance
const ListingCard = memo(({
  listing
}: {
  listing: any;
}) => <Link to={`/listings/${listing.slug}`} className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" aria-label={`${listing.name} details`}>
    <Card className="overflow-hidden group w-full h-full">
      <div className="aspect-[4/3] overflow-hidden">
        <BusinessTileImage 
          businessId={listing.id} 
          fallbackSrc={listing.image}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
        />
      </div>
      <CardHeader className="space-y-1 min-w-0">
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <CardTitle className="text-base truncate min-w-0">{listing.name}</CardTitle>
            {typeof listing.rating === "number" && <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm">{listing.rating.toFixed(1)}</span>
              </div>}
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs max-w-[80px] truncate">{listing.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="-mt-2 min-w-0">
        <div className="flex items-center gap-3 text-sm text-muted-foreground min-w-0">
          <div className="flex min-w-0 items-center gap-1 flex-1">
            <MapPin className="h-4 w-4 opacity-70 shrink-0" />
            <span className="truncate min-w-0">{listing.address || 'No address available'}</span>
          </div>
          {listing.wheelchair && <>
              <span className="h-1 w-1 rounded-full bg-border shrink-0" />
              <Badge variant="outline" className="gap-1 shrink-0 text-xs">
                <Accessibility className="h-3.5 w-3.5" />
                Accessible
              </Badge>
            </>}
        </div>
      </CardContent>
    </Card>
  </Link>);
ListingCard.displayName = "ListingCard";
export default ExploreListings;