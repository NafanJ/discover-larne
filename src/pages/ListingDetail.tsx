import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { listings } from "@/data/listings";
import { Badge } from "@/components/ui/badge";

const ListingDetail = () => {
  const { slug } = useParams();
  const listing = listings.find((l) => l.slug === slug);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Listing not found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find this listing.</p>
        </main>
      </div>
    );
  }

  const metaTitle = `${listing.name} | Discover Larne`;
  const metaDescription = `${listing.description}`.slice(0, 155);
  const canonical = typeof window !== "undefined" ? window.location.href : `/listings/${listing.slug}`;

  const jsonLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    url: canonical,
    image: listing.images,
    telephone: listing.contact?.phone,
    sameAs: listing.contact?.website ? [listing.contact.website] : undefined,
  };

  if (listing.hours && listing.hours.length) {
    jsonLd.openingHoursSpecification = listing.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.closed ? undefined : h.open,
      closes: h.closed ? undefined : h.close,
    }));
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
            {listing.address && <span className="text-sm">• {listing.address}</span>}
          </div>
        </header>

        <section aria-label="Gallery" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {listing.images.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-md">
                <img
                  src={src}
                  alt={`${listing.name} image ${i + 1}`}
                  loading="lazy"
                  className="h-44 md:h-56 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <article className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-muted-foreground">{listing.description}</p>
          </article>

          <aside className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Contact</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {listing.contact?.phone && <li>Phone: <a className="underline underline-offset-4" href={`tel:${listing.contact.phone}`}>{listing.contact.phone}</a></li>}
                {listing.contact?.email && <li>Email: <a className="underline underline-offset-4" href={`mailto:${listing.contact.email}`}>{listing.contact.email}</a></li>}
                {listing.contact?.website && <li>Website: <a className="underline underline-offset-4" href={listing.contact.website} target="_blank" rel="noopener noreferrer">{listing.contact.website}</a></li>}
                {listing.contact?.address && <li>Address: {listing.contact.address}</li>}
              </ul>
            </div>

            {listing.hours && (
              <div>
                <h2 className="text-xl font-semibold">Business hours</h2>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {listing.hours.map((h, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{h.day}</span>
                      <span>{h.closed ? 'Closed' : `${h.open} – ${h.close}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </section>

        {listing.reviews && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-3">Reviews</h2>
            <div className="space-y-4">
              {listing.reviews.map((r, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.author}</p>
                    <p className="text-sm text-muted-foreground">{typeof r.rating === 'number' ? `${r.rating.toFixed(1)}/5` : ''}</p>
                  </div>
                  <p className="mt-1 text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ListingDetail;
