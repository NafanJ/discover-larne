import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="container py-12 md:py-16">
      <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold">Start exploring stories from Larne</h3>
          <p className="opacity-90 mt-1">Browse categories, discover locals, and plan your next visit.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="secondary" size="lg" className="rounded-lg"><Link to="/explore">Explore Stories</Link></Button>
          <Button asChild variant="secondary" size="lg" className="rounded-lg"><Link to="/explore">Browse Categories</Link></Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
