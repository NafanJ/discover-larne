import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const ListingDetail = () => {
  const { slug } = useParams();
  
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

        {listing.photo && (
          <section aria-label="Gallery" className="mb-8">
            <div className="overflow-hidden rounded-md">
              <img
                src={listing.photo}
                alt={`${listing.name} - ${listing.category} in Larne`}
                loading="lazy"
                className="h-64 md:h-96 w-full object-cover"
              />
            </div>
          </section>
        )}

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

      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
