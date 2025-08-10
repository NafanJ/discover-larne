import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
            decoding="async"
          />
          <span className="sr-only">Discover Larne</span>
        </Link>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/explore/listings" className="story-link">Explore</Link>
                  </NavigationMenuLink>
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

          {/* Mobile menu */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-2">
                  <SheetClose asChild>
                    <Link to="/explore/listings" className="story-link">Explore</Link>
                  </SheetClose>
                  <div className="mt-2 text-xs text-muted-foreground">Plan Your Trip</div>
                  <SheetClose asChild>
                    <Link to="/plan" className="story-link">Plan Overview</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/itineraries" className="story-link">Popular Itineraries</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/about" className="story-link">About</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/contact" className="story-link">Contact</Link>
                  </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
      </nav>
    </header>
  );
};

export default Navbar;
