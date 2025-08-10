import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

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
          <div className="hidden md:flex items-center gap-4 text-sm">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4">
                    <div className="grid grid-cols-2 gap-6 w-[480px]">
                      <div>
                        <p className="text-xs font-medium opacity-70 mb-2">By Category</p>
                        <ul className="space-y-1">
                          <li><Link to="/explore/category/things-to-do" className="story-link">Things to Do</Link></li>
                          <li><Link to="/explore/category/events" className="story-link">Events</Link></li>
                          <li><Link to="/explore/category/eat-and-drink" className="story-link">Eat &amp; Drink</Link></li>
                          <li><Link to="/explore/category/stays" className="story-link">Stays</Link></li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium opacity-70 mb-2">By Location</p>
                        <ul className="space-y-1">
                          <li><Link to="/explore/location/larne-town" className="story-link">Larne Town</Link></li>
                          <li><Link to="/explore/location/coastal-route" className="story-link">Coastal Route</Link></li>
                          <li><Link to="/explore/location/surrounding-areas" className="story-link">Surrounding Areas</Link></li>
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>


                <NavigationMenuItem>
                  <NavigationMenuTrigger>Plan Your Trip</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4">
                    <ul className="w-56 space-y-1">
                      <li><Link to="/plan" className="story-link">Plan Overview</Link></li>
                      <li><Link to="/itineraries" className="story-link">Popular Itineraries</Link></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/about" className="hover-scale story-link">About</Link>
            <Link to="/contact" className="hover-scale story-link">Contact</Link>
            
          </div>
      </nav>
    </header>
  );
};

export default Navbar;
