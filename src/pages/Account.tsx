import Navbar from "@/components/layout/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/layout/Footer";


const Account = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <Helmet>
        <title>Your Account | Discover Larne</title>
        <meta name="description" content="Manage your Discover Larne account and preferences." />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : '/account'} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          name: 'User Account'
        })}</script>
      </Helmet>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Account</h1>
      <p className="mt-2 text-muted-foreground">Sign in and profile management coming soon.</p>
    </main>
    <Footer />
  </div>

);

export default Account;
