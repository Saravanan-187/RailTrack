import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, Train } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center shadow-railway-strong">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Train className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Track Not Found</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have taken a different route. 
          Let's get you back on track.
        </p>
        
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full btn-railway text-white"
            onClick={() => window.location.href = "/"}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? <a href="/support" className="text-primary hover:underline">Contact Support</a>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;