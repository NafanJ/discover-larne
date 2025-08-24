import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/use-auth";
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
import Auth from "./pages/Auth";
import Account from "./pages/Account";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount < 3) return true;
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
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
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
