import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAuthHeaders, getToken } from "@/utils/auth";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { bookingsAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/Header";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await bookingsAPI.getUserBookings(user.id, token);
      if (response.ok) {
        const userBookings = await response.json();
        setBookings(userBookings);
      } else {
        toast.error("Failed to fetch bookings");
        setBookings([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.train_id.toLowerCase().includes(term) ||
        booking.booking_reference?.toLowerCase().includes(term) ||
        booking.class_type?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "date_asc":
        result.sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date));
        break;
      case "date_desc":
        result.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
        break;
      case "amount_asc":
        result.sort((a, b) => a.total_amount - b.total_amount);
        break;
      case "amount_desc":
        result.sort((a, b) => b.total_amount - a.total_amount);
        break;
      default:
        result.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
    }
    
    setFilteredBookings(result);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <Header />
        <div className="container py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-medium mb-2">Please Login</h3>
              <p className="text-muted-foreground mb-4">You need to be logged in to view your bookings.</p>
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your train bookings</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by train ID, booking reference..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Date (Newest First)</SelectItem>
                    <SelectItem value="date_asc">Date (Oldest First)</SelectItem>
                    <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
                    <SelectItem value="amount_asc">Amount (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {bookings.length === 0 ? "No bookings yet" : "No matching bookings"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {bookings.length === 0 
                  ? "You haven't made any train bookings yet." 
                  : "Try adjusting your search or filter criteria."}
              </p>
              <Button asChild>
                <Link to="/">Book a Train</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{booking.status}</p>
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
      </div>
    </div>
  );
};

export default Bookings;