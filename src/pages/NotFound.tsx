
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-dark">
      <div className="text-center p-6 max-w-md mx-auto">
        <div className="h-16 w-16 bg-app-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-app-purple" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! This page doesn't exist or is restricted.
        </p>
        <Button asChild className="bg-app-purple hover:bg-app-purple/90">
          <a href="/">Return to Safety</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
