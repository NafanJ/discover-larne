import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import portrait1 from "@/assets/larne/portrait-1.jpg";
import portrait2 from "@/assets/larne/portrait-2.jpg";
import place1 from "@/assets/larne/place-1.jpg";
import { Users, Map, HeartHandshake } from "lucide-react";

const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Discover Larne | About</title>
        <meta name="description" content="Discover Larne’s mission: celebrating people, places, and stories along the Causeway Coastal Route." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/about'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              name: "About Discover Larne",
              url: `${siteUrl}/about`
            },
            {
              "@type": "Organization",
              name: "Discover Larne",
              url: siteUrl,
              logo: `${siteUrl}/lovable-uploads/9215e784-7ca1-498b-8252-d21e67748e57.png`
            }
          ]
        })}</script>
      </Helmet>

      <header className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">About Discover Larne</h1>
        <p className="mt-3 text-muted-foreground">We celebrate Larne’s people, places, and stories on the Causeway Coastal Route—connecting visitors with authentic local experiences.</p>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-3">
        <article className="p-6 rounded-xl border bg-card">
          <Users className="h-6 w-6 text-foreground/80" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-medium">Community First</h2>
          <p className="mt-2 text-sm text-muted-foreground">We spotlight locals—artists, makers, guides—whose stories bring Larne to life.</p>
        </article>
        <article className="p-6 rounded-xl border bg-card">
          <Map className="h-6 w-6 text-foreground/80" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-medium">Places That Matter</h2>
          <p className="mt-2 text-sm text-muted-foreground">From harbour views to the Black Arch, we curate places worth your time.</p>
        </article>
        <article className="p-6 rounded-xl border bg-card">
          <HeartHandshake className="h-6 w-6 text-foreground/80" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-medium">Responsible Travel</h2>
          <p className="mt-2 text-sm text-muted-foreground">We encourage slow, sustainable discovery that benefits our town.</p>
        </article>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p className="text-muted-foreground">Born from a love of Larne, this project gathers stories and practical guides to help you explore with confidence. Whether you’re here for a day or a week, we make it easy to find great experiences—and the people behind them.</p>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Curated recommendations by locals</li>
            <li>Up-to-date guides to places and events</li>
            <li>Inspiring photography from the area</li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <img src={portrait1} alt="Local resident in Larne – Discover Larne" loading="lazy" className="rounded-lg object-cover h-44 w-full" />
          <img src={place1} alt="Scenic view near Larne – Discover Larne" loading="lazy" className="rounded-lg object-cover h-44 w-full" />
          <img src={portrait2} alt="Maker from Larne – Discover Larne" loading="lazy" className="rounded-lg object-cover h-44 w-full col-span-2" />
        </div>
      </section>

      <aside className="mt-12 p-6 rounded-xl border bg-card">
        <p className="text-sm text-muted-foreground">Have an idea, story, or correction? We’d love to hear from you. Visit our <a href="/contact" className="underline underline-offset-2">contact page</a>.</p>
      </aside>
    </main>
  </div>
);

export default About;
