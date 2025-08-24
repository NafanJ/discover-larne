import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "@/components/listing/HeroSection";
import { AboutSection } from "@/components/listing/AboutSection";
import { ContactCard } from "@/components/listing/ContactCard";
import { BusinessHoursCard } from "@/components/listing/BusinessHoursCard";
import { ModernGallery } from "@/components/listing/ModernGallery";
import { ReviewsPreview } from "@/components/listing/ReviewsPreview";
import { CTASection } from "@/components/listing/CTASection";

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
      <main className="container py-4 md:py-10 space-y-6 md:space-y-8">
        <Helmet>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="canonical" href={canonical} />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>

        {/* Hero Section */}
        <HeroSection businessId={listing.id} business={listing} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* About Section */}
            <AboutSection business={listing} />
            
            {/* Gallery */}
            <ModernGallery businessId={listing.id} />
            
            {/* Reviews Preview */}
            <ReviewsPreview businessName={listing.name} rating={listing.rating} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Contact Card */}
            <ContactCard business={listing} />
            
            {/* Business Hours Card */}
            <BusinessHoursCard workingHours={listing.working_hours} />
          </div>
        </div>

        {/* Call to Action Section */}
        <CTASection businessOwnerId={listing.owner_id} />
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
