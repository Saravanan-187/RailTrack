import { useState } from "react";
import { Search, ArrowUpDown, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroTrainImage from "@/assets/hero-train.jpg";

const HeroSection = ({ onSearch }) => {
  const [swapStations, setSwapStations] = useState(false);
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: ""
  });

  const handleSwapStations = () => {
    setSwapStations(!swapStations);
    setSearchForm(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSearchTrains = () => {
    // Validate form before searching
    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      alert("Please fill in all fields");
      return;
    }
    
    // Pass search data to parent component
    if (onSearch) {
      onSearch(searchForm);
    }
    
    // Scroll to train results section
    const trainsSection = document.getElementById("available-trains");
    if (trainsSection) {
      trainsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickDates = [
    { label: "Today", value: new Date().toISOString().split('T')[0] },
    { label: "Tomorrow", value: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: "Day After", value: new Date(Date.now() + 172800000).toISOString().split('T')[0] }
  ];

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroTrainImage} 
          alt="Modern train" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 left-10 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  ✨ India's Most Trusted Railway Booking
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Book Your
                  <span className="block text-accent">
                    Train Journey
                  </span>
                  in Seconds
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                  Experience hassle-free train ticket booking with instant confirmation, 
                  real-time updates, and seamless journey planning across India.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="p-8 bg-white/95 backdrop-blur-lg border-white/20 shadow-railway-strong hover-lift">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-primary mb-6">Search Trains</h3>
                  
                  {/* From/To Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">From</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter departure city"
                          value={searchForm.from}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, from: e.target.value }))}
                          className="pl-10 h-12 border-border focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">To</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter destination city"
                          value={searchForm.to}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, to: e.target.value }))}
                          className="pl-10 h-12 border-border focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Swap Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSwapStations}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 md:right-1/2 md:translate-x-1/2 z-10 bg-white shadow-md hover:bg-secondary border"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date of Journey</label>
                    <div className="flex gap-2 flex-wrap">
                      <div className="relative flex-1 min-w-[200px]">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={searchForm.date}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, date: e.target.value }))}
                          className="pl-10 h-12 border-border focus:border-primary"
                        />
                      </div>
                      {quickDates.map((dateOption) => (
                        <Button
                          key={dateOption.label}
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchForm(prev => ({ ...prev, date: dateOption.value }))}
                          className="h-12 px-4 border-border hover:bg-secondary"
                        >
                          {dateOption.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Passengers and Class section removed */}

                  {/* Search Button */}
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg font-semibold btn-railway text-white hover:scale-105 smooth-transition"
                    onClick={handleSearchTrains}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Trains
                  </Button>

                  {/* Additional Info */}
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Free Cancellation</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Instant Refund</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;