import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExploreIndex from "./pages/ExploreIndex";
import ExploreCategory from "./pages/ExploreCategory";
import ExploreLocation from "./pages/ExploreLocation";
import ExploreListings from "./pages/ExploreListings";
import Plan from "./pages/Plan";
import GuideDetail from "./pages/GuideDetail";
import Itineraries from "./pages/Itineraries";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ListingDetail from "./pages/ListingDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<ExploreIndex />} />
            <Route path="/explore/listings" element={<ExploreListings />} />
            <Route path="/explore/category/:slug" element={<ExploreCategory />} />
            <Route path="/explore/location/:slug" element={<ExploreLocation />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/guides/:slug" element={<GuideDetail />} />
            <Route path="/listings/:slug" element={<ListingDetail />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
