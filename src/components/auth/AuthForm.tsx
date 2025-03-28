
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  onAuthSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // In a real app, we would use proper authentication
  // For now we just simulate it with localStorage
  const handleAuth = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (isRegistering) {
        // Registration
        if (pin.length >= 4 && pin === confirmPin) {
          localStorage.setItem('userPin', pin);
          toast({
            title: "Registration successful",
            description: "Your security PIN has been set.",
          });
          onAuthSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "PINs must match and be at least 4 digits.",
          });
        }
      } else {
        // Login
        const storedPin = localStorage.getItem('userPin');
        if (storedPin && pin === storedPin) {
          toast({
            title: "Authentication successful",
            description: "Welcome back to Secret Gesture Keeper.",
          });
          onAuthSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Authentication failed",
            description: "Incorrect PIN.",
          });
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth();
  };

  return (
    <Card className="w-[350px] bg-card/90 backdrop-blur-sm border-muted">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-app-purple/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-app-purple" />
          </div>
        </div>
        <CardTitle className="text-center text-xl">
          {isRegistering ? "Create Security PIN" : "Enter Security PIN"}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegistering 
            ? "Set a PIN to secure your gestures" 
            : "Authenticate to access your secure gestures"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Input
                id="pin"
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="bg-muted/50"
                required
                autoComplete="new-password"
              />
            </div>
            
            {isRegistering && (
              <div className="grid gap-2">
                <Input
                  id="confirmPin"
                  type="password"
                  placeholder="Confirm PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  className="bg-muted/50"
                  required
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-app-purple hover:bg-app-purple/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                {isRegistering ? "Registering..." : "Authenticating..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {isRegistering ? "Register" : "Authenticate"}
              </span>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="link" 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-muted-foreground"
          >
            {isRegistering ? "Already have a PIN? Login" : "New user? Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
