import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthHeaders, getToken } from "@/utils/auth";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { bookingsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const { checkUpcomingBookings } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setBookingsLoading(true);
      const token = getToken();
      
      const response = await bookingsAPI.getUserBookings(user.id, token);
      if (response.ok) {
        const userBookings = await response.json();
        setBookings(userBookings);
        
        // Check for upcoming bookings to create reminders
        checkUpcomingBookings(userBookings);
      } else {
        toast.error("Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setBookingsLoading(false);
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const token = getToken();
      const response = await bookingsAPI.cancelBooking(bookingId, token);
      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        toast.success("Booking cancelled successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // Get upcoming bookings (within next 7 days)
  const getUpcomingBookings = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return bookings.filter(booking => {
      if (booking.status !== "confirmed") return false;
      const bookingDate = new Date(booking.booking_date);
      return bookingDate >= now && bookingDate <= nextWeek;
    });
  };

  const upcomingBookings = getUpcomingBookings();

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile Dashboard</h1>
        <p className="text-muted-foreground">View your account details and manage your bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.full_name || "User"}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You are not logged in</p>
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Journeys */}
          {upcomingBookings.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming Journeys</CardTitle>
                <CardDescription>Your trips in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="p-3 bg-secondary/10 rounded-lg">
                    <div className="font-medium text-sm">Train {booking.train_id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(booking.booking_date).toLocaleDateString()} • {booking.class_type}
                    </div>
                  </div>
                ))}
                {upcomingBookings.length > 3 && (
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to="/bookings">View all upcoming journeys</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bookings Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Bookings</CardTitle>
                  <CardDescription>View and manage your train bookings</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/">Book New Train</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mb-2"></div>
                    <p>Loading bookings...</p>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't made any train bookings yet.</p>
                  <Button asChild>
                    <Link to="/">Book a Train</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>Booking #{booking.booking_reference || booking.id.slice(0, 8)}</CardTitle>
                            <CardDescription>Booked on {new Date(booking.booking_date).toLocaleDateString()}</CardDescription>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Confirmed'}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Train ID</p>
                            <p className="font-medium">{booking.train_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Class</p>
                            <p className="font-medium">{booking.class_type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-medium">₹{booking.total_amount}</p>
                          </div>
                        </div>
                        {booking.status !== 'cancelled' && (
                          <div className="mt-4 pt-4 border-t">
                            <Button variant="outline" onClick={() => cancelBooking(booking.id)}>
                              Cancel Booking
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;