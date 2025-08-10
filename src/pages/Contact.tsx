import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Contact Discover Larne</title>
        <meta name="description" content="Get in touch with the Discover Larne team." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/contact'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Discover Larne'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-muted-foreground">We’d love to hear from you.</p>
    </main>
  </div>
);

export default Contact;
