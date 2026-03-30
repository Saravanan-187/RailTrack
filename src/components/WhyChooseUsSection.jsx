import { 
  CheckCircle, 
  Zap, 
  Shield, 
  Headphones, 
  RefreshCw,
  Users,
  Star,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: CheckCircle,
      title: "RailTrack Confirm",
      subtitle: "Guaranteed Confirmation",
      description: "Get confirmed tickets on waitlisted trains or receive 3X refund guarantee.",
      highlight: "99% Success Rate",
      color: "text-green-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      icon: Shield,
      title: "Seat Guarantee",
      subtitle: "No More Waiting",
      description: "Guaranteed seats on waitlisted tickets or instant full refund with compensation.",
      highlight: "100% Guarantee",
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      subtitle: "Quick Booking",
      description: "Book your tickets in under 60 seconds with our streamlined booking process.",
      highlight: "< 60 Seconds",
      color: "text-yellow-600",
      bgGradient: "from-yellow-50 to-amber-50"
    },
    {
      icon: RefreshCw,
      title: "Smart Connect",
      subtitle: "Connecting Trains",
      description: "Find the best connecting train routes when direct trains are not available.",
      highlight: "Smart Routes",
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-violet-50"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      subtitle: "Always Here",
      description: "Round-the-clock customer support for all your booking and travel queries.",
      highlight: "24/7 Available",
      color: "text-indigo-600",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      icon: Users,
      title: "Group Booking",
      subtitle: "Travel Together",
      description: "Special discounts and easy booking for group travels and family trips.",
      highlight: "Up to 25% Off",
      color: "text-red-600",
      bgGradient: "from-red-50 to-pink-50"
    }
  ];

  const stats = [
    { number: "5M+", label: "Happy Customers" },
    { number: "50M+", label: "Tickets Booked" },
    { number: "99.9%", label: "Uptime" },
    { number: "4.8★", label: "User Rating" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Why Choose RailTrack
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            India's Most Trusted Railway Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the future of train booking with our innovative features, 
            guaranteed services, and unmatched customer satisfaction.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title}
                className={`group hover-lift border-border/50 hover:border-primary/30 smooth-transition animate-fade-in bg-gradient-to-br ${benefit.bgGradient}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <Icon className="w-full h-full" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Icon and Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/80 rounded-lg shadow-sm group-hover:scale-110 smooth-transition">
                        <Icon className={`w-6 h-6 ${benefit.color}`} />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-white/80 text-foreground border-white/50"
                      >
                        {benefit.highlight}
                      </Badge>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary smooth-transition">
                      {benefit.title}
                    </h3>
                    <h4 className="text-sm font-medium text-primary mb-3">
                      {benefit.subtitle}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Hover Effect Line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent transform scale-x-0 group-hover:scale-x-100 smooth-transition"></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Customer Testimonial Preview */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-railway-strong">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-foreground mb-4 italic">
                "RailTrack made our family trip planning so easy! Got confirmed tickets 
                instantly and the live tracking feature was incredibly helpful."
              </blockquote>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">PK</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-foreground">Priya Kumari</div>
                  <div className="text-muted-foreground">Verified Customer</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;