import { Clock, MapPin, Zap, Wifi, UtensilsCrossed, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/utils/auth";
import { bookingsAPI } from "@/services/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PassengerDetailsForm from "@/components/PassengerDetailsForm";
import BookingConfirmation from "@/components/BookingConfirmation";

const TrainResults = ({ searchCriteria }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [filteredTrainData, setFilteredTrainData] = useState([]);

  // Sample train data - in a real app, this would come from an API
  const allTrainData = [
    {
      id: "507f1f77bcf86cd799439014",
      trainNumber: "12025",
      trainName: "Shatabdi Express",
      from: { station: "Mumbai Central", code: "CSTM", time: "06:15" },
      to: { station: "Pune Junction", code: "PUNE", time: "09:45" },
      duration: "3h 30m",
      classes: [
        { type: "CC", price: "₹950", availability: "Available", seats: 42 },
        { type: "EC", price: "₹1,600", availability: "Available", seats: 28 }
      ],
      amenities: ["Wifi", "Pantry", "Charging Point", "AC"],
      rating: 4.7,
      onTime: 94
    },
    {
      id: "507f1f77bcf86cd799439015",
      trainNumber: "22607",
      trainName: "Kerala Express",
      from: { station: "New Delhi", code: "NDLS", time: "11:30" },
      to: { station: "Trivandrum Central", code: "TVC", time: "18:45+2" },
      duration: "31h 15m",
      classes: [
        { type: "1A", price: "₹4,250", availability: "Available", seats: 6 },
        { type: "2A", price: "₹2,650", availability: "Available", seats: 18 },
        { type: "3A", price: "₹1,725", availability: "Available", seats: 32 },
        { type: "SL", price: "₹825", availability: "WL 8", seats: 0 }
      ],
      amenities: ["Pantry", "Charging Point"],
      rating: 4.3,
      onTime: 85
    },
    {
      id: "507f1f77bcf86cd799439016",
      trainNumber: "16203",
      trainName: "Hyderabad Express",
      from: { station: "Secunderabad Junction", code: "SC", time: "14:30" },
      to: { station: "Bangalore City", code: "SBC", time: "22:15" },
      duration: "7h 45m",
      classes: [
        { type: "2S", price: "₹420", availability: "Available", seats: 75 },
        { type: "SL", price: "₹650", availability: "Available", seats: 24 },
        { type: "3A", price: "₹1,225", availability: "RAC 3", seats: 2 }
      ],
      amenities: ["Pantry"],
      rating: 4.1,
      onTime: 82
    },
    {
      id: "507f1f77bcf86cd799439017",
      trainNumber: "11021",
      trainName: "Gujarat Express",
      from: { station: "Ahmedabad Junction", code: "ADI", time: "08:45" },
      to: { station: "Mumbai Central", code: "CSTM", time: "15:30" },
      duration: "6h 45m",
      classes: [
        { type: "2S", price: "₹325", availability: "Available", seats: 68 },
        { type: "SL", price: "₹525", availability: "Available", seats: 36 },
        { type: "3A", price: "₹1,150", availability: "Available", seats: 18 }
      ],
      amenities: ["Pantry"],
      rating: 4.0,
      onTime: 79
    },
    {
      id: "507f1f77bcf86cd799439018",
      trainNumber: "12609",
      trainName: "Howrah Express",
      from: { station: "Howrah Junction", code: "HWH", time: "22:15" },
      to: { station: "New Delhi", code: "NDLS", time: "04:30+2" },
      duration: "30h 15m",
      classes: [
        { type: "1A", price: "₹4,250", availability: "Available", seats: 8 },
        { type: "2A", price: "₹2,750", availability: "Available", seats: 22 },
        { type: "3A", price: "₹1,850", availability: "Available", seats: 45 },
        { type: "SL", price: "₹825", availability: "WL 12", seats: 0 }
      ],
      amenities: ["Wifi", "Pantry", "Charging Point"],
      rating: 4.6,
      onTime: 91
    },
    {
      id: "507f1f77bcf86cd799439019",
      trainNumber: "12125",
      trainName: "Mumbai Rajdhani",
      from: { station: "Mumbai Central", code: "CSTM", time: "17:15" },
      to: { station: "New Delhi", code: "NDLS", time: "11:30+1" },
      duration: "18h 15m",
      classes: [
        { type: "1A", price: "₹4,850", availability: "Available", seats: 12 },
        { type: "2A", price: "₹2,950", availability: "Available", seats: 24 },
        { type: "3A", price: "₹1,950", availability: "RAC 5", seats: 5 }
      ],
      amenities: ["Wifi", "Pantry", "Charging Point", "AC"],
      rating: 4.8,
      onTime: 93
    },
    {
      id: "507f1f77bcf86cd799439020",
      trainNumber: "22610",
      trainName: "Chennai Express",
      from: { station: "Chennai Central", code: "MAS", time: "08:30" },
      to: { station: "Bangalore City", code: "SBC", time: "15:45" },
      duration: "7h 15m",
      classes: [
        { type: "2S", price: "₹350", availability: "Available", seats: 85 },
        { type: "SL", price: "₹580", availability: "Available", seats: 42 },
        { type: "3A", price: "₹1,180", availability: "Available", seats: 28 }
      ],
      amenities: ["Pantry"],
      rating: 4.2,
      onTime: 84
    }
  ];

  // Filter trains based on search criteria
  useEffect(() => {
    if (!searchCriteria || (!searchCriteria.from && !searchCriteria.to)) {
      // If no search criteria, show all trains
      setFilteredTrainData(allTrainData);
      return;
    }

    const filtered = allTrainData.filter(train => {
      const fromMatch = searchCriteria.from 
        ? train.from.station.toLowerCase().includes(searchCriteria.from.toLowerCase()) ||
          train.from.code.toLowerCase().includes(searchCriteria.from.toLowerCase())
        : true;
        
      const toMatch = searchCriteria.to 
        ? train.to.station.toLowerCase().includes(searchCriteria.to.toLowerCase()) ||
          train.to.code.toLowerCase().includes(searchCriteria.to.toLowerCase())
        : true;
        
      return fromMatch && toMatch;
    });

    setFilteredTrainData(filtered);
  }, [searchCriteria]);

  const getAvailabilityColor = (availability) => {
    if (availability === "Available") return "bg-green-100 text-green-800";
    if (availability.includes("RAC")) return "bg-yellow-100 text-yellow-800";
    if (availability.includes("WL")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "Wifi": return <Wifi className="w-4 h-4" />;
      case "Pantry": return <UtensilsCrossed className="w-4 h-4" />;
      case "Charging Point": return <Zap className="w-4 h-4" />;
      case "AC": return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleBookNow = (train, classType) => {
    if (!isAuthenticated) {
      toast.info("Please login to book a train");
      navigate("/login");
      return;
    }
    
    // Find the full class object based on the class type
    const selectedClassObj = train.classes.find(cls => cls.type === classType);
    
    setSelectedTrain(train);
    setSelectedClass(selectedClassObj); // Pass the full class object instead of just the type
    setShowPassengerForm(true);
  };

  const handleBookingComplete = (data) => {
    // Set the booking data for confirmation
    setBookingData(data);
    setShowPassengerForm(false);
    setBookingConfirmed(true);
  };

  const handleCancelBooking = () => {
    setShowPassengerForm(false);
    setSelectedTrain(null);
    setSelectedClass(null);
  };

  // If booking is confirmed, show confirmation page
  if (bookingConfirmed) {
    return <BookingConfirmation bookingData={bookingData} />;
  }

  // If passenger form is requested, show it
  if (showPassengerForm) {
    return (
      <div className="container py-8">
        <PassengerDetailsForm 
          train={selectedTrain}
          selectedClass={selectedClass}
          onBookingComplete={handleBookingComplete}
          onCancel={handleCancelBooking}
        />
      </div>
    );
  }

  return (
    <section id="available-trains" className="py-12 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">Available Trains</h2>
            <div className="text-sm text-muted-foreground">
              {filteredTrainData.length} trains found
            </div>
          </div>
          {searchCriteria && (searchCriteria.from || searchCriteria.to) && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{searchCriteria.from || "Any"} → {searchCriteria.to || "Any"}</span>
              </div>
              {searchCriteria.date && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(searchCriteria.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Train List */}
        <div className="space-y-4">
          {filteredTrainData.length > 0 ? (
            filteredTrainData.map((train, index) => (
              <Card 
                key={train.id}
                className="hover-lift border-border/50 hover:border-primary/30 smooth-transition animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Train Info */}
                    <div className="lg:col-span-1">
                      <div className="space-y-2">
                        <h3 className="font-bold text-lg text-primary">
                          {train.trainNumber}
                        </h3>
                        <p className="text-sm text-foreground font-medium">
                          {train.trainName}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>{train.onTime}% On Time</span>
                          </div>
                          <div>★ {train.rating}</div>
                        </div>
                      </div>
                    </div>

                    {/* Route & Timing */}
                    <div className="lg:col-span-1">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                              {train.from.time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {train.from.code}
                            </div>
                          </div>
                          <div className="flex-1 px-4">
                            <div className="text-center text-sm text-muted-foreground mb-1">
                              {train.duration}
                            </div>
                            <div className="w-full h-px bg-border relative">
                              <div className="absolute right-0 top-0 w-2 h-2 bg-primary rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-foreground">
                              {train.to.time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {train.to.code}
                            </div>
                          </div>
                        </div>
                        
                        {/* Amenities */}
                        <div className="flex items-center space-x-2">
                          {train.amenities.map((amenity) => (
                            <div
                              key={amenity}
                              className="flex items-center space-x-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md"
                            >
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Classes & Pricing */}
                    <div className="lg:col-span-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {train.classes.map((cls) => (
                          <div
                            key={cls.type}
                            className="border border-border rounded-lg p-3 text-center hover:border-primary/30 smooth-transition"
                          >
                            <div className="font-semibold text-foreground mb-1">
                              {cls.type}
                            </div>
                            <div className="text-lg font-bold text-primary mb-2">
                              {cls.price}
                            </div>
                            <Badge
                              className={`text-xs ${getAvailabilityColor(cls.availability)} mb-2`}
                            >
                              {cls.availability}
                            </Badge>
                            <Button
                              size="sm"
                              variant={cls.seats > 0 ? "default" : "secondary"}
                              disabled={cls.seats === 0}
                              className="w-full text-xs"
                              onClick={() => handleBookNow(train, cls.type)}
                            >
                              {cls.seats > 0 ? "Book Now" : "Waitlist"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">No trains found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find more trains.
              </p>
            </div>
          )}
        </div>

        {/* Load More */}

      </div>
    </section>
  );
};

export default TrainResults;