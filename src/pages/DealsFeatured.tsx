import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";

const DealsFeatured = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Featured Deals | Larne</title>
        <meta name="description" content="Hand-picked featured deals for stays, food, and activities in Larne." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/deals/featured'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Featured Deals'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Featured Deals</h1>
      <p className="mt-2 text-muted-foreground">Top curated offers across Larne.</p>
    </main>
  </div>
);

export default DealsFeatured;
