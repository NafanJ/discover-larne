import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const DealsIndex = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Deals in Larne | Offers & Discounts</title>
        <meta name="description" content="Browse the latest travel deals, featured offers, and discounts around Larne." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/deals'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Deals in Larne'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Deals</h1>
      <p className="mt-2 text-muted-foreground">Find featured and latest offers to make the most of your trip.</p>
      <div className="mt-6 flex gap-4">
        <Link className="story-link" to="/deals/featured">Featured Deals</Link>
        <Link className="story-link" to="/deals/latest">Latest Offers</Link>
      </div>
    </main>
  </div>
);

export default DealsIndex;
