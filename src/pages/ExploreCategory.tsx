import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const toTitle = (slug?: string) =>
  (slug || "").split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

const ExploreCategory = () => {
  const { slug } = useParams();
  const title = `${toTitle(slug)} in Larne`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>{`Discover Larne | ${toTitle(slug)}`}</title>
          <meta name="description" content={`Discover ${toTitle(slug)} across Larne and the Causeway Coast.`} />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : `/explore/category/${slug}`} />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: title,
            url: typeof window !== 'undefined' ? window.location.href : ''
          })}</script>
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">Curated places, stories, and highlights for {toTitle(slug)}.</p>
      </main>
    </div>
  );
};

export default ExploreCategory;
