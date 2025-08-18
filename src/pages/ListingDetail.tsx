import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCoverImage, BusinessGallery } from "@/components/business/BusinessImageDisplay";
import { BusinessImageSection } from "@/components/business/BusinessImageSection";
import { BusinessImagePlaceholders } from "@/components/business/BusinessImagePlaceholders";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

const ListingDetail = () => {
  const { slug } = useParams();
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);
  
  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Listing not found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find this listing.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const metaTitle = `${listing.name} | Discover Larne`;
  const metaDescription = `${listing.description || ''}`.slice(0, 155);
  const canonical = typeof window !== "undefined" ? window.location.href : `/listings/${listing.id}`;
  const isOwner = currentUser && listing.owner_id === currentUser.id;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    url: canonical,
    image: listing.photo ? [listing.photo] : undefined,
    telephone: listing.phone,
    address: listing.full_address,
  };

  if (listing.working_hours) {
    try {
      const hours = JSON.parse(listing.working_hours as string);
      if (Array.isArray(hours)) {
        jsonLd.openingHoursSpecification = hours.map((h: any) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.day,
          opens: h.closed ? undefined : h.open,
          closes: h.closed ? undefined : h.close,
        }));
      }
    } catch (e) {
      // Invalid JSON, skip hours
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="canonical" href={canonical} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{listing.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-muted-foreground">
            <Badge variant="secondary">{listing.category}</Badge>
            {typeof listing.rating === 'number' && (
              <span className="text-sm">Rating: {listing.rating.toFixed(1)}</span>
            )}
            {listing.full_address && <span className="text-sm">• {listing.full_address}</span>}
          </div>
        </header>

        {/* Cover and Profile Images */}
        <section aria-label="Business Images" className="mb-8">
          <BusinessCoverImage businessId={listing.id} />
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <article className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground">{listing.description || 'No description available.'}</p>
          </article>

          <aside className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Contact</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {listing.phone && <li>Phone: <a className="underline underline-offset-4" href={`tel:${listing.phone}`}>{listing.phone}</a></li>}
                {listing.full_address && <li>Address: {listing.full_address}</li>}
              </ul>
            </div>

            {listing.working_hours && (() => {
              try {
                const hours = JSON.parse(listing.working_hours as string);
                if (Array.isArray(hours)) {
                  return (
                    <div>
                      <h2 className="text-xl font-semibold">Business hours</h2>
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {hours.map((h: any, i: number) => (
                          <li key={i} className="flex justify-between">
                            <span>{h.day}</span>
                            <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              } catch (e) {
                return null;
              }
            })()}
          </aside>
        </section>

        {/* Gallery */}
        <BusinessGallery businessId={listing.id} className="mb-8" />

        {/* Image Management for Owners */}
        {isOwner ? (
          <BusinessImageSection 
            businessId={listing.id} 
            isOwner={isOwner} 
          />
        ) : (
          // Show upload placeholders for demonstration (in real app, this would only show to owners)
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-12 h-12 text-muted-foreground/50" />
              <h3 className="font-medium text-muted-foreground">Business Owner Image Upload</h3>
              <p className="text-sm text-muted-foreground/75 max-w-md">
                This section is only visible to business owners. If this is your business, 
                please log in to upload and manage your images.
              </p>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
