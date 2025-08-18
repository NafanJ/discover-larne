import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
const currentYear = new Date().getFullYear();
const Footer = () => {
  return <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold">Discover Larne</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Stories, places, and guides for Larne and the Causeway Coastal Route.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Larne, Northern Ireland
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a href="mailto:hello@discoverlarne.example" className="underline underline-offset-4">discoverlarne@gmail.com</a>
              </li>
            </ul>
          </div>

          <nav aria-label="Quick links" className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium">Explore</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/explore" className="hover:underline">Explore Home</Link></li>
                <li><Link to="/explore/category/things-to-do" className="hover:underline">Things to Do</Link></li>
                <li><Link to="/explore/location/larne-town" className="hover:underline">Larne Town</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Plan</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/plan" className="hover:underline">Plan Your Trip</Link></li>
                <li><Link to="/itineraries" className="hover:underline">Itineraries</Link></li>
                <li><Link to="/about" className="hover:underline">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Support</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
                <li><a href="#" className="hover:underline">Terms</a></li>
              </ul>
            </div>
          </nav>

          <div>
            <h3 className="text-sm font-medium">Follow</h3>
            <div className="mt-3 flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} Discover Larne. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built for fast, accessible browsing on any device.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;