import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { Button } from "@/components/ui/button";
import { Shield, Settings, LogOut, PlayCircle, Lock, Smartphone, Eye, EyeOff, Fingerprint, Sparkles, ChevronDown, Minimize } from "lucide-react";
import GestureRecorder, { GestureData } from '@/components/gesture/GestureRecorder';
import GestureList from '@/components/gesture/GestureList';
import SecurityFeatures from '@/components/security/SecurityFeatures';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import FloatingBubble from '@/components/sequence/FloatingBubble';
import { SequenceData } from '@/components/sequence/SequenceRecorder';
import SequenceRecorder from '@/components/sequence/SequenceRecorder';
import MinimizedSequenceRecorder from '@/components/sequence/MinimizedSequenceRecorder';
import SequenceList from '@/components/sequence/SequenceList';
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useFloatingSequence } from '@/components/sequence/useFloatingSequence';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gestures, setGestures] = useState<GestureData[]>([]);
  const [sequences, setSequences] = useState<SequenceData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [gestureToDelete, setGestureToDelete] = useState<string | null>(null);
  const [sequenceToDelete, setSequenceToDelete] = useState<string | null>(null);
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);
  const [hiddenApps, setHiddenApps] = useState<string[]>([]);
  const [hiddenContacts, setHiddenContacts] = useState<string[]>([]);
  const [showMoreFeatures, setShowMoreFeatures] = useState(false);
  const [appMinimized, setAppMinimized] = useState(false);
  const [isMinimizedRecording, setIsMinimizedRecording] = useState(false);
  const { toast } = useToast();
  
  const {
    activeSequence,
    isMinimized,
    startSequence,
    stopSequence,
    toggleMinimize
  } = useFloatingSequence();

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
    
    const savedSequences = localStorage.getItem('sequences');
    if (savedSequences) {
      try {
        setSequences(JSON.parse(savedSequences));
      } catch (e) {
        console.error('Failed to parse saved sequences', e);
      }
    }
    
    const savedHiddenApps = localStorage.getItem('hiddenApps');
    if (savedHiddenApps) {
      try {
        setHiddenApps(JSON.parse(savedHiddenApps));
      } catch (e) {
        console.error('Failed to parse hidden apps', e);
      }
    }
    
    const savedHiddenContacts = localStorage.getItem('hiddenContacts');
    if (savedHiddenContacts) {
      try {
        setHiddenContacts(JSON.parse(savedHiddenContacts));
      } catch (e) {
        console.error('Failed to parse hidden contacts', e);
      }
    }
  }, []);

  useEffect(() => {
    if (gestures.length > 0) {
      localStorage.setItem('gestures', JSON.stringify(gestures));
    }
  }, [gestures]);
  
  useEffect(() => {
    if (sequences.length > 0) {
      localStorage.setItem('sequences', JSON.stringify(sequences));
    }
  }, [sequences]);
  
  useEffect(() => {
    if (hiddenApps.length > 0) {
      localStorage.setItem('hiddenApps', JSON.stringify(hiddenApps));
    }
  }, [hiddenApps]);
  
  useEffect(() => {
    if (hiddenContacts.length > 0) {
      localStorage.setItem('hiddenContacts', JSON.stringify(hiddenContacts));
    }
  }, [hiddenContacts]);

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
    
    if (newGesture.name.includes("Lock/Unlock")) {
      handleLockUnlockDemo();
    } else if (newGesture.name.includes("Hide Apps")) {
      handleHideAppsDemo();
    } else if (newGesture.name.includes("Hide Contacts")) {
      handleHideContactsDemo();
    }
  };

  const handleLockUnlockDemo = () => {
    setIsPhoneLocked(!isPhoneLocked);
    
    toast({
      title: isPhoneLocked ? "Phone Unlocked" : "Phone Locked",
      description: isPhoneLocked 
        ? "Your device has been unlocked with your gesture" 
        : "Your device has been locked with your gesture",
    });
  };
  
  const handleHideAppsDemo = () => {
    if (hiddenApps.length > 0) {
      setHiddenApps([]);
      toast({
        title: "Apps Revealed",
        description: "Your hidden apps are now visible",
      });
    } else {
      setHiddenApps(['facebook', 'instagram', 'whatsapp']);
      toast({
        title: "Apps Hidden",
        description: "Selected apps are now hidden from your home screen",
      });
    }
  };
  
  const handleHideContactsDemo = () => {
    if (hiddenContacts.length > 0) {
      setHiddenContacts([]);
      toast({
        title: "Contacts Revealed",
        description: "Your hidden contacts are now visible",
      });
    } else {
      setHiddenContacts(['John Doe', 'Jane Smith', 'Contact 3']);
      toast({
        title: "Contacts Hidden",
        description: "Selected contacts are now hidden from your contacts list",
      });
    }
  };

  const handleDeleteGesture = (id: string) => {
    setGestureToDelete(id);
    setSequenceToDelete(null);
    setShowDeleteAlert(true);
  };

  const handleDeleteSequence = (id: string) => {
    setSequenceToDelete(id);
    setGestureToDelete(null);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (gestureToDelete) {
      setGestures(prev => prev.filter(g => g.id !== gestureToDelete));
      toast({
        title: "Gesture deleted",
        description: "The gesture has been deleted successfully.",
      });
    } else if (sequenceToDelete) {
      setSequences(prev => prev.filter(s => s.id !== sequenceToDelete));
      toast({
        title: "Sequence deleted",
        description: "The sequence has been deleted successfully.",
      });
    }
    setShowDeleteAlert(false);
    setGestureToDelete(null);
    setSequenceToDelete(null);
  };

  const handleEditGesture = (id: string) => {
    toast({
      title: "Coming soon",
      description: "Gesture editing will be available in a future update.",
    });
  };

  const handleEditSequence = (id: string) => {
    toast({
      title: "Coming soon",
      description: "Sequence editing will be available in a future update.",
    });
  };

  const handleAddSequence = (newSequence: SequenceData) => {
    if (!newSequence.createdAt) {
      newSequence.createdAt = new Date().toISOString();
    }
    setSequences(prev => [...prev, newSequence]);
    setIsMinimizedRecording(false);
    toast({
      title: "Sequence created",
      description: "New sequence has been added successfully.",
    });
  };
  
  const startMinimizedRecording = () => {
    setIsMinimizedRecording(true);
  };
  
  const cancelMinimizedRecording = () => {
    setIsMinimizedRecording(false);
  };

  const activateSequenceDemo = (sequenceId?: string) => {
    let targetSequence: SequenceData | undefined;
    
    if (sequenceId && sequences.length > 0) {
      targetSequence = sequences.find(s => s.id === sequenceId);
      if (targetSequence) {
        startSequence(targetSequence);
        return;
      }
    }
    
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
      timerEnabled: false,
      createdAt: new Date().toISOString()
    };
    
    startSequence(demoSequence);
  };

  const handleCloseSequence = () => {
    stopSequence();
  };

  const handleMinimizeApp = () => {
    setAppMinimized(true);
    toast({
      title: "App Minimized",
      description: "The app is now running in the background.",
    });
  };

  const handleGhostDeleteDemo = () => {
    toast({
      title: "Ghost Delete Activated",
      description: "Conversations have been cleared from the selected apps",
    });
  };
  
  const handleEmergencySignalDemo = () => {
    toast({
      title: "Emergency Signal Sent",
      description: "Your emergency contacts have been notified with your message and location",
    });
  };
  
  const handleStartAppDemo = () => {
    toast({
      title: "App Launched",
      description: "Selected app has been launched",
    });
  };
  
  const handleSilentRecordingDemo = () => {
    toast({
      title: "Silent Recording Started",
      description: "Audio is now being recorded in the background",
    });
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
      <div className="min-h-screen bg-app-dark overflow-y-auto">
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-app-purple/20 to-transparent" />
          
          <div className="w-full md:w-1/2 p-8 z-10 space-y-8 animate-fade-in">
            <div className="text-center md:text-left mb-8">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Shield className="h-10 w-10 text-app-purple mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-app-purple/80 bg-clip-text text-transparent">
                  Secret Gesture Keeper
                </h1>
              </div>
              <p className="text-lg text-gray-300 max-w-md mx-auto md:mx-0">
                Protect your privacy with custom gesture patterns and secure your digital life
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <FeatureCard 
                icon={<Fingerprint className="h-8 w-8 text-app-purple" />}
                title="Gesture Unlock"
                description="Create unique gesture patterns to unlock your device"
                delay={0.1}
              />
              <FeatureCard 
                icon={<Eye className="h-8 w-8 text-app-purple" />}
                title="Hide Apps"
                description="Keep your private apps hidden from prying eyes"
                delay={0.2}
              />
              <FeatureCard 
                icon={<Smartphone className="h-8 w-8 text-app-purple" />}
                title="Silent Mode"
                description="Enable emergency silent recording with gestures"
                delay={0.3}
              />
              <FeatureCard 
                icon={<Lock className="h-8 w-8 text-app-purple" />}
                title="Secure Sequences"
                description="Create multi-step security sequences"
                delay={0.4}
              />
            </div>
            
            <div className="flex justify-center md:justify-start pt-4">
              <Button 
                className="bg-app-purple hover:bg-app-purple/90 group transition-all duration-300"
                onClick={() => setShowMoreFeatures(!showMoreFeatures)}
              >
                <span>See more features</span>
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${showMoreFeatures ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            <div className={`transition-all duration-500 overflow-hidden ${showMoreFeatures ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <FeatureShowcase />
            </div>
          </div>
          
          <div className="w-full md:w-1/2 p-4 md:p-8 flex justify-center items-center z-10 animate-fade-in">
            <div className="w-full max-w-md relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-app-purple to-blue-500 rounded-lg blur opacity-30 animate-pulse-subtle"></div>
              <div className="relative">
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce text-white/50">
          <ChevronDown className="h-6 w-6" />
          <span className="text-xs">Scroll to learn more</span>
        </div>
      </div>
    );
  }

  if (isMinimizedRecording) {
    return (
      <>
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10" />
        <MinimizedSequenceRecorder 
          onSequenceRecorded={handleAddSequence}
          onCancel={cancelMinimizedRecording}
          sequenceName="New Sequence"
        />
      </>
    );
  }

  if (isMinimized && activeSequence) {
    return (
      <FloatingBubble 
        sequence={activeSequence} 
        onClose={handleCloseSequence}
        isMinimized={true}
        onToggleMinimize={toggleMinimize}
      />
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
              onClick={() => activateSequenceDemo()}
            >
              <PlayCircle className="h-3 w-3" />
              Demo Sequence
            </Button>
            {activeSequence && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={toggleMinimize}
              >
                <Minimize className="h-3 w-3" />
                Minimize
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center gap-1"
              onClick={handleLockUnlockDemo}
            >
              <Lock className="h-3 w-3" />
              {isPhoneLocked ? "Unlock" : "Lock"}
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
        <SecurityFeatures 
          onAddGesture={handleAddGesture} 
          onAddSequence={handleAddSequence}
          onActivateSequence={activateSequenceDemo}
          onGhostDelete={handleGhostDeleteDemo}
          onEmergencySignal={handleEmergencySignalDemo}
          onStartApp={handleStartAppDemo}
          onSilentRecording={handleSilentRecordingDemo}
          onLockUnlock={handleLockUnlockDemo}
          onHideApps={handleHideAppsDemo}
          onHideContacts={handleHideContactsDemo}
        />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-xl font-semibold">Your Gestures</h2>
          <div className="flex flex-col sm:flex-row gap-3">
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

            <Button 
              className="bg-app-purple hover:bg-app-purple/90"
              onClick={startMinimizedRecording}
            >
              Record New Sequence
            </Button>
          </div>
        </div>

        <GestureList 
          gestures={gestures} 
          onDeleteGesture={handleDeleteGesture} 
          onEditGesture={handleEditGesture} 
        />
        
        <h2 className="text-xl font-semibold pt-4">Your Sequences</h2>
        <SequenceList 
          sequences={sequences} 
          onDeleteSequence={handleDeleteSequence} 
          onEditSequence={handleEditSequence} 
          onActivateSequence={activateSequenceDemo}
        />
      </main>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {gestureToDelete ? "gesture" : "sequence"} and any associated security feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {activeSequence && !isMinimized && (
        <FloatingBubble 
          sequence={activeSequence} 
          onClose={handleCloseSequence}
          isMinimized={false}
          onToggleMinimize={toggleMinimize}
        />
      )}
      
      {isPhoneLocked && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Lock className="h-16 w-16 text-app-purple mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Device Locked</h2>
          <p className="text-sm text-gray-300 mb-6">Use your gesture to unlock</p>
          <Button 
            variant="outline" 
            onClick={handleLockUnlockDemo}
            className="border-app-purple text-app-purple hover:bg-app-purple/20"
          >
            Simulate Unlock Gesture
          </Button>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  delay?: number
}) => {
  return (
    <div 
      className="p-6 rounded-lg bg-card/40 backdrop-blur-sm border border-muted hover:border-app-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-app-purple/20 group"
      style={{ 
        animation: `fade-in 0.5s ease-out ${delay}s backwards`,
        transformOrigin: 'center'
      }}
    >
      <div className="flex items-center mb-3">
        <div className="recording-indicator mr-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold group-hover:text-app-purple transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

const FeatureShowcase = () => {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4 text-center md:text-left flex items-center">
        <Sparkles className="h-5 w-5 text-app-purple mr-2" />
        Feature Showcase
      </h2>
      
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          <CarouselItem className="md:basis-1/1">
            <div className="p-1">
              <Card className="border-muted bg-card/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-full aspect-video bg-gradient-to-br from-app-dark to-app-purple/20 rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-dashed border-app-purple/40 rounded-full animate-spin-slow"></div>
                      <div className="w-60 h-60 border border-app-purple/20 rounded-full"></div>
                    </div>
                    <div className="z-10 bg-card/60 backdrop-blur-md p-4 rounded-lg border border-app-purple/30 transform hover:scale-105 transition-transform duration-300">
                      <h3 className="text-lg font-medium mb-2">Custom Gestures</h3>
                      <p className="text-sm text-muted-foreground">Draw unique patterns to trigger security actions</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Create and save personalized gesture patterns to enhance your security</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          
          <CarouselItem className="md:basis-1/1">
            <div className="p-1">
              <Card className="border-muted bg-card/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-full aspect-video bg-gradient-to-br from-app-dark to-app-purple/20 rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-app-purple opacity-80"></div>
                      <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-app-purple opacity-80"></div>
                      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-app-purple opacity-80"></div>
                      <div className="absolute h-0.5 bg-app-purple/60 w-20 top-[30%] left-[30%] transform -rotate-45"></div>
                      <div className="absolute h-0.5 bg-app-purple/60 w-24 top-[45%] left-[45%] transform rotate-45"></div>
                    </div>
                    <div className="z-10 bg-card/60 backdrop-blur-md p-4 rounded-lg border border-app-purple/30 transform hover:scale-105 transition-transform duration-300">
                      <h3 className="text-lg font-medium mb-2">Multi-Point Sequences</h3>
                      <p className="text-sm text-muted-foreground">Chain actions together for advanced security</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Create sequences of actions that work together to protect your privacy</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          
          <CarouselItem className="md:basis-1/1">
            <div className="p-1">
              <Card className="border-muted bg-card/40 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-full aspect-video bg-gradient-to-br from-app-dark to-app-purple/20 rounded-md flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-40 h-64 border-2 border-app-purple/40 rounded-3xl overflow-hidden">
                        <div className="absolute inset-2 bg-black rounded-2xl"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <EyeOff className="h-12 w-12 text-app-purple/70" />
                        </div>
                      </div>
                    </div>
                    <div className="z-10 bg-card/60 backdrop-blur-md p-4 rounded-lg border border-app-purple/30 transform hover:scale-105 transition-transform duration-300 absolute bottom-4 right-4">
                      <h3 className="text-lg font-medium mb-2">Privacy Protection</h3>
                      <p className="text-sm text-muted-foreground">Hide sensitive apps and contacts</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Keep your private information secure from unwanted access</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-4">
          <CarouselPrevious className="relative inset-0 translate-y-0 h-8 w-8 rounded-full" />
          <CarouselNext className="relative inset-0 translate-y-0 h-8 w-8 rounded-full" />
        </div>
      </Carousel>
    </div>
  );
};

export default Index;
