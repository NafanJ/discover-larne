import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Footer from "@/components/layout/Footer";


const toTitle = (slug?: string) =>
  (slug || "").split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

const ExploreLocation = () => {
  const { slug } = useParams();
  const title = `${toTitle(slug)} in Larne`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>{`Discover Larne | ${toTitle(slug)}`}</title>
          <meta name="description" content={`Explore highlights around ${toTitle(slug)} in Larne.`} />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : `/explore/location/${slug}`} />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            url: typeof window !== 'undefined' ? window.location.href : ''
          })}</script>
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">Top picks, maps, and stories for {toTitle(slug)}.</p>
      </main>
      <Footer />
    </div>

  );
};

export default ExploreLocation;
