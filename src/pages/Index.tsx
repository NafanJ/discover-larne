import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HighlightSection from "@/components/sections/HighlightSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HighlightSection />
        <AboutSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
