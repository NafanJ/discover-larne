import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Accessibility } from "lucide-react";
import { Link } from "react-router-dom";
import { BusinessTileImage } from "@/components/business/BusinessImageDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { normalizeCategory } from "@/lib/utils";

const HighlightSection = () => {
  const featuredBusinessNames = [
    'Olderfleet Rowing Club',
    'The Black Arch', 
    'Wear It Out',
    'The Rinkha Ice Cream and Toys'
  ];

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['featured-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .in('name', featuredBusinessNames)
        .order('name');
      
      if (error) throw error;
      
      // Sort by the desired order
      const orderedBusinesses = featuredBusinessNames.map(name => 
        data?.find(business => business.name === name)
      ).filter(Boolean);
      
      return orderedBusinesses;
    },
  });

  if (isLoading) {
    return (
      <section className="container pt-0 pb-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Featured People & Places</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardHeader>
              <CardContent className="-mt-2">
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return (
      <section className="container pt-0 pb-6">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Featured People & Places</h2>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>No businesses available to showcase at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container pt-0 pb-6">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Featured People & Places</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {businesses.map((business) => (
          <Link
            key={business.id}
            to={`/listings/${business.id}`}
            className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={`${business.name} details`}
          >
            <Card className="overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden">
                <BusinessTileImage 
                  businessId={business.id} 
                  fallbackSrc={business.photo}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <CardTitle className="text-base truncate">{business.name}</CardTitle>
                    {typeof business.rating === 'number' && (
                      <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="text-sm">{business.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  {business.category && (
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {normalizeCategory(business.category)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="-mt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {business.full_address && (
                    <div className="flex min-w-0 items-center gap-1">
                      <MapPin className="h-4 w-4 opacity-70" />
                      <span className="truncate">{business.full_address}</span>
                    </div>
                  )}
                  {business.wheelchair_accessible && (
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
