import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/utils/auth";
import { bookingsAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";

const PassengerDetailsForm = ({ train, selectedClass, onBookingComplete, onCancel }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "" }
  ]);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", gender: "" }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const newPassengers = [...passengers];
      newPassengers.splice(index, 1);
      setPassengers(newPassengers);
    }
  };

  const updatePassenger = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleContactInfoChange = (field, value) => {
    setContactInfo({
      ...contactInfo,
      [field]: value
    });
  };

  const validateForm = () => {
    // Check if all passenger fields are filled
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name || !passenger.age || !passenger.gender) {
        toast.error("Please fill in all passenger details");
        return false;
      }
      
      // Validate age
      const age = parseInt(passenger.age);
      if (isNaN(age) || age < 1 || age > 120) {
        toast.error("Please enter a valid age for all passengers");
        return false;
      }
    }
    
    // Check contact info
    if (!contactInfo.email || !contactInfo.phone) {
      toast.error("Please provide contact information");
      return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    // Simple phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactInfo.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to book a train");
      navigate("/login");
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare passenger details
      const passengerDetails = {
        passengers: passengers,
        contact: contactInfo
      };
      
      // Get the price for the selected class (parse from string)
      let price = 0;
      if (selectedClass && selectedClass.price) {
        try {
          const priceString = selectedClass.price.replace(/[₹,]/g, "");
          price = parseFloat(priceString);
        } catch (parseError) {
          console.error("Error parsing price:", parseError);
          price = 0;
        }
      } else {
        console.warn("Selected class or price is missing:", selectedClass);
      }
      
      const bookingData = {
        train_id: train.id, // This is now a valid MongoDB ObjectId or a mock ID
        user_id: user.id,
        class_type: selectedClass?.type || "",
        passenger_details: passengerDetails,
        total_amount: price,
        booking_date: new Date().toISOString()
      };
      
      // Validate required fields
      if (!bookingData.train_id || !bookingData.user_id || !bookingData.class_type) {
        toast.error("Missing required booking information");
        setLoading(false);
        return;
      }
      
      // Send booking data to backend
      const token = getToken();
      const response = await bookingsAPI.createBooking(bookingData, token);
      
      if (response.ok) {
        const bookingResult = await response.json();
        toast.success("Booking created successfully!");
        onBookingComplete(bookingResult);
      } else {
        const errorText = await response.text();
        let errorMessage = "Failed to create booking";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Passenger Details</CardTitle>
        <CardDescription>
          Please provide passenger information for your booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Train Info Summary */}
          <div className="bg-secondary/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{train.trainName} ({train.trainNumber})</h3>
            <div className="flex justify-between text-sm">
              <span>{train.from.station} ({train.from.code})</span>
              <span>→</span>
              <span>{train.to.station} ({train.to.code})</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{train.from.time}</span>
              <span>{train.duration}</span>
              <span>{train.to.time}</span>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">Class:</span> {selectedClass.type} | 
              <span className="font-medium ml-2">Price:</span> {selectedClass.price}
            </div>
          </div>
          
          {/* Passenger Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Passenger Information</h3>
            {passengers.map((passenger, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-5">
                  <Label htmlFor={`name-${index}`}>Full Name</Label>
                  <Input
                    id={`name-${index}`}
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`age-${index}`}>Age</Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    value={passenger.age}
                    onChange={(e) => updatePassenger(index, "age", e.target.value)}
                    placeholder="Age"
                    min="1"
                    max="120"
                  />
                </div>
                <div className="md:col-span-3">
                  <Label>Gender</Label>
                  <Select 
                    value={passenger.gender} 
                    onValueChange={(value) => updatePassenger(index, "gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 flex items-end">
                  {passengers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePassenger(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPassenger}>
              Add Another Passenger
            </Button>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactInfoChange("email", e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                  placeholder="10-digit phone number"
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel}>
              Back
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PassengerDetailsForm;