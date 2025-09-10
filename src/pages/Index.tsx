import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HighlightSection from "@/components/sections/HighlightSection";
import AboutSection from "@/components/sections/AboutSection";
import CTASection from "@/components/sections/CTASection";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";


const Index = () => {
  const { user, signOut } = useAuth();
  
  const forceReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Emergency reset button for stuck authentication */}
      {user && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          <Button onClick={signOut} variant="destructive" size="sm">
            Force Sign Out
          </Button>
          <Button onClick={forceReset} variant="outline" size="sm">
            Emergency Reset
          </Button>
        </div>
      )}
      
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
