import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Plan = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Plan Your Trip to Larne | Guides & Tips</title>
        <meta name="description" content="Plan your trip with guides, FAQs, and practical tips for visiting Larne." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/plan'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Plan Your Trip'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Plan Your Trip</h1>
      <p className="mt-2 text-muted-foreground">Useful information to make your visit smooth and memorable.</p>
      <div className="mt-6 flex gap-4">
        <Link className="story-link" to="/itineraries">Popular Itineraries</Link>
      </div>
    </main>
  </div>
);

export default Plan;
