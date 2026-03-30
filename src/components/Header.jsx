import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Bell } from "lucide-react";
import { Train } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleTrainsClick = (e) => {
    // Check if we're already on the home page
    if (window.location.pathname === "/") {
      // Prevent default link behavior and scroll to trains section
      e.preventDefault();
      const trainsSection = document.getElementById("available-trains");
      if (trainsSection) {
        trainsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    // If not on home page, let the Link component navigate to home page
  };

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Train className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RailTrack</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link 
            to="/" 
            className="text-sm font-medium hover:underline underline-offset-4"
            onClick={handleTrainsClick}
          >
            Trains
          </Link>
          {isAuthenticated && (
            <Link to="/bookings" className="text-sm font-medium hover:underline underline-offset-4">
              My Bookings
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/notifications">
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">Notifications</span>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </Link>
                  </Button>
                )}
                <span className="text-sm hidden md:inline">
                  Hi, {user?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <Button variant="ghost" asChild>
                  <Link to="/profile">Profile</Link>
                </Button>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;