import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>About Discover Larne</title>
        <meta name="description" content="Learn about Discover Larne and our mission to highlight people and places on the Causeway Coast." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/about'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Discover Larne'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">About Us</h1>
      <p className="mt-2 text-muted-foreground">We celebrate Larne’s people, places, and stories.</p>
    </main>
  </div>
);

export default About;
