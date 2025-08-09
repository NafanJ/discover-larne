import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="font-semibold tracking-tight text-lg">
          Discover Larne
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
