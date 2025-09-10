import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HighlightSection from "@/components/sections/HighlightSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/layout/Footer";
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Helmet>
          <title>Discover Larne | Home</title>
        </Helmet>
        <Hero />
        <HighlightSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
