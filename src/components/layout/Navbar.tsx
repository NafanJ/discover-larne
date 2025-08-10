import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" aria-label="Discover Larne home" className="inline-flex items-center">
          <img
            src="/lovable-uploads/9215e784-7ca1-498b-8252-d21e67748e57.png"
            alt="Discover Larne logo"
            className="h-8 w-auto md:h-10"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <span className="sr-only">Discover Larne</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover-scale story-link">People</Link>
          <Link to="/" className="hover-scale story-link">Places</Link>
          <Link to="/" className="hover-scale story-link">Stories</Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
