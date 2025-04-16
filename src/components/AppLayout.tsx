
import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { cn } from "@/lib/utils";
import { Home, BarChart3, Calendar, Settings, Menu, X, BookOpen, CheckSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FineNotification from "./FineNotification";
import Footer from "./Footer";

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Close menu when changing routes on mobile
    if (isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && isMobile && !target.closest(".mobile-menu") && !target.closest(".menu-trigger")) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, isMobile]);
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/subjects", label: "Subjects", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/timetable", label: "Timetable", icon: <Calendar className="h-5 w-5" /> },
    { path: "/stats", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { path: "/todo", label: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded size-8 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg hidden xs:inline-block">AttendTrack</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Sidebar - desktop only */}
        <nav className="w-64 border-r hidden md:block p-4">
          <div className="space-y-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "nav-link",
                  location.pathname === item.path && "active"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="absolute inset-y-0 left-0 w-3/4 max-w-xs bg-background shadow-lg border-r animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between p-4 border-b">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="bg-primary text-primary-foreground p-1 rounded size-8 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-lg">AttendTrack</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>
              
              <div className="space-y-1 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "nav-link",
                      location.pathname === item.path && "active"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 pt-4">
            <FineNotification />
          </div>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
