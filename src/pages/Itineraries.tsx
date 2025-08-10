import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/layout/Footer";


const Itineraries = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Discover Larne | Itineraries</title>
        <meta name="description" content="Browse curated itineraries for exploring Larne and the Causeway Coast." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/itineraries'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Popular Itineraries'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Popular Itineraries</h1>
      <p className="mt-2 text-muted-foreground">Day-by-day plans to see the best of Larne.</p>
    </main>
    <Footer />
  </div>

);

export default Itineraries;
