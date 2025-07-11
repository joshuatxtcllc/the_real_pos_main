import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { CartWidget } from '@/components/CartWidget';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

// Define menu structure
const menuStructure = [
  {
    title: "Dashboard",
    path: "/dashboard",
    subItems: [
      { title: "Overview", path: "/dashboard" },
      { title: "Inventory", path: "/inventory" },
      { title: "Inventory Tracking", path: "/inventory-tracking" },
    ]
  },
  {
    title: "Orders",
    path: "/orders",
    subItems: [
      { title: "Orders List", path: "/orders" },
      { title: "Order Progress", path: "/order-progress/1" },
      { title: "Payment Links", path: "/payment-links" },
    ]
  },
  {
    title: "Production",
    path: "/production",
    subItems: [
      { title: "Kanban Board", path: "/production" },
      { title: "Materials Orders", path: "/materials" },
      { title: "Materials Pick List", path: "/materials-pick-list" },
      { title: "Kanban Test", path: "/kanban-test" },
    ]
  },
  {
    title: "POS",
    path: "/",
    subItems: [
      { title: "New Order", path: "/" },
      { title: "Cost Estimator", path: "/cost-estimator" },
      { title: "Mat Options", path: "/mat-test" },
      { title: "Mat Border Demo", path: "/mat-border-demo" },
      { title: "Pricing", path: "/pricing" },
      { title: "Pricing Monitor", path: "/pricing-monitor" },
      { title: "Larson Optimizer", path: "/larson-optimizer" },
      { title: "Frame Education", path: "/frame-education" },
    ]
  },
  {
    title: "Integration",
    path: "/hub",
    subItems: [
      { title: "Hub", path: "/hub" },
      { title: "Webhook", path: "/webhook-integration" },
      { title: "Vendor Settings", path: "/vendor-settings" },
      { title: "System Health", path: "/system-health" },
    ]
  },
  {
    title: "Communications",
    path: "/voice-calls",
    subItems: [
      { title: "Voice Calls", path: "/voice-calls" },
      { title: "Automated Notifications", path: "/automated-notifications" },
      { title: "Notifications", path: "/notifications" },
      { title: "Customers", path: "/customers" },
      { title: "Customer Portal", path: "/customer-portal" },
    ]
  }
];

export default function Header({ darkMode, toggleTheme }: HeaderProps) {
  const [location] = useLocation();
  const { isMobile } = useMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const { authenticated, user } = useAuth();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when changing location
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get cart items from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(Array.isArray(parsedCart) ? parsedCart.length : 0);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        setCartItems(0);
      }
    }

    // Listen for storage events to update cart count when it changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        try {
          const newCart = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(Array.isArray(newCart) ? newCart.length : 0);
        } catch (e) {
          console.error('Error parsing cart from storage event:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-background border-b dark:border-gray-800 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-3 lg:px-4 h-14 lg:h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
          <span className="font-bold text-xl text-foreground">Jay's Frames</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {menuStructure.map((menuItem, idx) => (
                <NavigationMenuItem key={idx}>
                  <NavigationMenuTrigger className="text-foreground font-semibold">
                    {menuItem.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-2">
                      {menuItem.subItems.map((subItem, subIdx) => (
                        <li key={subIdx}>
                          <Link href={subItem.path}>
                            <a className={cn(
                              "block select-none rounded-md p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                              location === subItem.path && "bg-accent/50 text-accent-foreground"
                            )}>
                              {subItem.title}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right section: Theme toggle, cart, mobile menu button */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
            className="text-foreground hover:text-foreground"
          >
            {darkMode ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
          </Button>

          {/* Cart icon and counter */}
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/checkout/cart"} className="text-foreground hover:text-foreground">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-foreground" />
              {cartItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[0.7rem]">
                  {cartItems}
                </Badge>
              )}
            </div>
          </Button>

          {/* User info (if authenticated) */}
          {authenticated && user && (
            <span className="text-sm hidden md:inline-block text-foreground">
              {user.name || user.username || 'User'}
            </span>
          )}

          {/* Mobile menu button */}
          <Button 
            className="md:hidden text-foreground hover:text-foreground hover:bg-accent border-2 border-primary/30 bg-background shadow-sm" 
            variant="outline" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-14 lg:top-16 left-0 w-full bg-background border-b border-border shadow-lg z-40">
          <nav className="container mx-auto px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {menuStructure.map((menuItem, idx) => (
              <div key={idx} className="mb-4">
                <Link href={menuItem.path}>
                  <div className="font-semibold text-lg mb-2 text-foreground hover:text-primary cursor-pointer py-2 border-b border-border">
                    {menuItem.title}
                  </div>
                </Link>
                <div className="pl-4 space-y-1">
                  {menuItem.subItems.map((subItem, subIdx) => (
                    <Link key={subIdx} href={subItem.path}>
                      <div
                        className={cn(
                          "py-2 text-sm font-medium hover:text-primary transition-colors cursor-pointer rounded-md px-2 hover:bg-accent",
                          location === subItem.path 
                            ? "text-primary bg-accent" 
                            : "text-foreground"
                        )}
                      >
                        {subItem.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Additional menu items */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <Link href="/customers" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Customers
              </Link>

              <Link href="/frame-education">
                <div 
                  className={cn(
                    "py-2 px-2 font-medium hover:text-primary transition-colors cursor-pointer rounded-md hover:bg-accent",
                    location === "/frame-education" 
                      ? "text-primary bg-accent" 
                      : "text-foreground"
                  )}
                >
                  Frame Education
                </div>
              </Link>

              <Link href="/notifications" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Notifications
              </Link>

              <div className="py-3 px-2 flex items-center justify-between bg-muted rounded-md">
                <span className="font-medium text-foreground">Cart Items:</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  {cartItems}
                </span>
              </div>

              {authenticated && user && (
                <div className="py-3 px-2 bg-muted rounded-md">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.name || user.username || 'User'}
                  </span>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}


    </header>
  );
}