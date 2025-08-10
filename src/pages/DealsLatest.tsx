import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";

const DealsLatest = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Latest Offers | Larne</title>
        <meta name="description" content="The latest limited-time offers and discounts in Larne." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/deals/latest'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Latest Offers'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Latest Offers</h1>
      <p className="mt-2 text-muted-foreground">Newest deals and seasonal discounts.</p>
    </main>
  </div>
);

export default DealsLatest;
