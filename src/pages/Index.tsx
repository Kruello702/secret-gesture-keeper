import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from "@/components/ui/button";
import { Shield, Settings, LogOut, PlayCircle } from "lucide-react";
import GestureRecorder, { GestureData } from '@/components/gesture/GestureRecorder';
import GestureList from '@/components/gesture/GestureList';
import SecurityFeatures from '@/components/security/SecurityFeatures';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import FloatingBubble from '@/components/sequence/FloatingBubble';
import { SequenceData } from '@/components/sequence/SequenceRecorder';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gestures, setGestures] = useState<GestureData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [gestureToDelete, setGestureToDelete] = useState<string | null>(null);
  const [activeSequence, setActiveSequence] = useState<SequenceData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const hasPin = localStorage.getItem('userPin') !== null;
    
    if (import.meta.env.DEV && hasPin) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
    
    const savedGestures = localStorage.getItem('gestures');
    if (savedGestures) {
      try {
        setGestures(JSON.parse(savedGestures));
      } catch (e) {
        console.error('Failed to parse saved gestures', e);
      }
    }
  }, []);

  useEffect(() => {
    if (gestures.length > 0) {
      localStorage.setItem('gestures', JSON.stringify(gestures));
    }
  }, [gestures]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const handleAddGesture = (newGesture: GestureData) => {
    setGestures(prev => [...prev, newGesture]);
    setIsRecording(false);
  };

  const handleDeleteGesture = (id: string) => {
    setGestureToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDeleteGesture = () => {
    if (gestureToDelete) {
      setGestures(prev => prev.filter(g => g.id !== gestureToDelete));
      toast({
        title: "Gesture deleted",
        description: "The gesture has been deleted successfully.",
      });
      setShowDeleteAlert(false);
      setGestureToDelete(null);
    }
  };

  const handleEditGesture = (id: string) => {
    toast({
      title: "Coming soon",
      description: "Gesture editing will be available in a future update.",
    });
  };

  const activateSequenceDemo = () => {
    const securityFeatures = document.querySelector('security-features');
    
    const demoSequence: SequenceData = {
      id: 'demo-sequence',
      name: 'Demo Sequence',
      points: [
        {
          id: 'point-1',
          type: 'tap',
          position: { x: 100, y: 200 }
        },
        {
          id: 'point-2',
          type: 'double-tap',
          position: { x: 300, y: 300 }
        },
        {
          id: 'point-3',
          type: 'swipe',
          position: { x: 500, y: 400 },
          targetPosition: { x: 700, y: 400 }
        }
      ],
      timerEnabled: false
    };
    
    setActiveSequence(demoSequence);
    
    toast({
      title: "Sequence Activated",
      description: "Demo sequence has been activated.",
    });
  };

  const handleCloseSequence = () => {
    setActiveSequence(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-dark">
        <div className="animate-pulse flex flex-col items-center">
          <Shield className="h-12 w-12 text-app-purple mb-2" />
          <p className="text-app-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-app-purple/10 to-transparent" />
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-dark pb-20">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-muted">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-app-purple mr-2" />
            <h1 className="text-lg font-semibold text-foreground">Secret Gesture Keeper</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={activateSequenceDemo}
            >
              <PlayCircle className="h-3 w-3" />
              Demo Sequence
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <SecurityFeatures onAddGesture={handleAddGesture} />
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Gestures</h2>
          <Dialog open={isRecording} onOpenChange={setIsRecording}>
            <DialogTrigger asChild>
              <Button className="bg-app-purple hover:bg-app-purple/90">
                Record New Gesture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record New Gesture</DialogTitle>
                <DialogDescription>
                  Draw a unique gesture pattern that will be saved to your library
                </DialogDescription>
              </DialogHeader>
              <GestureRecorder 
                onGestureRecorded={handleAddGesture} 
                onCancel={() => setIsRecording(false)}
                gestureName="Custom Gesture" 
              />
            </DialogContent>
          </Dialog>
        </div>

        <GestureList 
          gestures={gestures} 
          onDeleteGesture={handleDeleteGesture} 
          onEditGesture={handleEditGesture} 
        />
      </main>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this gesture and any associated security feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGesture} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {activeSequence && (
        <FloatingBubble 
          sequence={activeSequence} 
          onClose={handleCloseSequence} 
        />
      )}
    </div>
  );
};

export default Index;
