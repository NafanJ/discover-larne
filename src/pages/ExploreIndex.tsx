import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";


const ExploreIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <Helmet>
          <title>Discover Larne | Explore</title>
          <meta name="description" content="Explore things to do, events, food & drink, and places to stay in Larne by category and location." />
          <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/explore'} />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Explore Larne',
            url: typeof window !== 'undefined' ? window.location.href : ''
          })}</script>
        </Helmet>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Explore Larne</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">Browse by category or location to discover the best of Larne and the Causeway Coast.</p>
        </header>
        <section>
          <h2 className="text-xl font-medium mb-3">Start exploring</h2>
          <p className="text-muted-foreground mb-4">Browse all listings with filters and sorting.</p>
          <div>
            <Link to="/explore/listings" className="story-link">Browse all listings</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>

  );
};

export default ExploreIndex;
