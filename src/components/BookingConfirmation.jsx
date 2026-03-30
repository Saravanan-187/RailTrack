import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Printer, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingConfirmation = ({ bookingData }) => {
  const navigate = useNavigate();
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    // In a real implementation, this would download a PDF
    alert("In a real implementation, this would download a PDF ticket");
  };
  
  // Generate a mock booking reference if not provided
  const bookingReference = bookingData?.booking_reference || 
    bookingData?.id?.slice(0, 8) || 
    "RVJ" + Math.floor(100000 + Math.random() * 900000);
  
  // Format date
  const bookingDate = bookingData?.booking_date ? 
    new Date(bookingData.booking_date).toLocaleDateString() : 
    new Date().toLocaleDateString();
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your train ticket has been successfully booked
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Booking Details</CardTitle>
              <CardDescription>
                Reference: {bookingReference}
              </CardDescription>
            </div>
            <Badge className="mt-2 md:mt-0 bg-green-100 text-green-800 text-sm">
              Confirmed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Train Information */}
          <div>
            <h3 className="font-semibold mb-3">Journey Details</h3>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">
                  {bookingData?.train?.trainName || "Howrah Rajdhani Express"} ({bookingData?.train?.trainNumber || "12301"})
                </span>
                <span className="text-sm text-muted-foreground">
                  {bookingData?.class_type || "2A"}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="font-semibold">
                    {bookingData?.train?.from?.station || "New Delhi"} ({bookingData?.train?.from?.code || "NDLS"})
                  </div>
                  <div className="text-sm">
                    {bookingData?.train?.from?.time || "16:55"}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">
                    {bookingData?.train?.duration || "17h 10m"}
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="text-xs text-muted-foreground">Direct</div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">To</div>
                  <div className="font-semibold">
                    {bookingData?.train?.to?.station || "Howrah Junction"} ({bookingData?.train?.to?.code || "HWH"})
                  </div>
                  <div className="text-sm">
                    {bookingData?.train?.to?.time || "10:05+1"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Passenger Information */}
          <div>
            <h3 className="font-semibold mb-3">Passenger Details</h3>
            <div className="space-y-3">
              {(bookingData?.passenger_details?.passengers || [{ name: "John Doe", age: "30", gender: "Male" }]).map((passenger, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <div className="font-medium">{passenger.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {passenger.age} years, {passenger.gender}
                    </div>
                  </div>
                  <Badge variant="secondary">Passenger {index + 1}</Badge>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Booking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Booking Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Date:</span>
                  <span>{bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Reference:</span>
                  <span className="font-mono">{bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold">₹{bookingData?.total_amount || "2,695"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span>Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono">TXN{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{bookingData?.passenger_details?.contact?.email || "john.doe@example.com"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{bookingData?.passenger_details?.contact?.phone || "+91 9876543210"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="w-4 h-4" />
          Print Ticket
        </Button>
        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={() => navigate("/bookings")} className="gap-2">
          View All Bookings
        </Button>
      </div>
      
      {/* Important Information */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Important Information</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Please carry a valid ID proof along with this ticket</li>
            <li>• Check-in closes 30 minutes before departure</li>
            <li>• Platform information will be available 30 minutes before departure</li>
            <li>• For cancellations, please visit the bookings page</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;