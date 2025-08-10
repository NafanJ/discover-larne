import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const toTitle = (slug?: string) =>
  (slug || "").split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");

const GuideDetail = () => {
  const { slug } = useParams();
  const title = `${toTitle(slug)} Guide`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>{`${title} | Larne Guides`}</title>
          <meta name="description" content={`Read our guide: ${toTitle(slug)}.`} />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : `/guides/${slug}`} />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title
          })}</script>
        </Helmet>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">Guide content coming soon.</p>
      </main>
    </div>
  );
};

export default GuideDetail;
