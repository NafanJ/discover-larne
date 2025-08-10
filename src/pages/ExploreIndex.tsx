import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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
        <section className="grid md:grid-cols-2 gap-8">
          <article>
            <h2 className="text-xl font-medium mb-3">By Category</h2>
            <ul className="grid gap-2">
              <li><Link to="/explore/category/things-to-do" className="story-link">Things to Do</Link></li>
              <li><Link to="/explore/category/events" className="story-link">Events</Link></li>
              <li><Link to="/explore/category/eat-and-drink" className="story-link">Eat &amp; Drink</Link></li>
              <li><Link to="/explore/category/stays" className="story-link">Stays</Link></li>
            </ul>
          </article>
          <article>
            <h2 className="text-xl font-medium mb-3">By Location</h2>
            <ul className="grid gap-2">
              <li><Link to="/explore/location/larne-town" className="story-link">Larne Town</Link></li>
              <li><Link to="/explore/location/coastal-route" className="story-link">Coastal Route</Link></li>
              <li><Link to="/explore/location/surrounding-areas" className="story-link">Surrounding Areas</Link></li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
};

export default ExploreIndex;
