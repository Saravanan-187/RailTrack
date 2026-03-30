import { 
  FileText, 
  Activity, 
  Utensils, 
  Phone, 
  CreditCard, 
  Clock,
  Shield,
  Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const quickServices = [
    {
      icon: FileText,
      title: "Check PNR Status",
      description: "Get real-time updates on your ticket status",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/pnr-status"
    },
    {
      icon: Activity,
      title: "Live Train Status",
      description: "Track your train's current location and timing",
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/live-status"
    },
    {
      icon: Utensils,
      title: "Order Food",
      description: "Pre-order meals for your train journey",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/food-order"
    },
    {
      icon: Phone,
      title: "Rail Helpline",
      description: "24/7 customer support and assistance",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/support"
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Multiple payment options with secure checkout",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/payments"
    },
    {
      icon: Clock,
      title: "Quick Booking",
      description: "Book tickets in under 2 minutes",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      href: "/quick-book"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security"
    },
    {
      icon: Award,
      title: "Trusted by Millions",
      description: "5+ million happy customers"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Book anytime, anywhere"
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Quick Services */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Quick Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a smooth train journey, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {quickServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.title} 
                className="group hover-lift cursor-pointer border-border/50 hover:border-primary/30 smooth-transition"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${service.bgColor} group-hover:scale-110 smooth-transition`}>
                      <Icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary smooth-transition">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 justify-start text-primary hover:bg-primary/10"
                  >
                    Access Service →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl p-8 shadow-railway">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;