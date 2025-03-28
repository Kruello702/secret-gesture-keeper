
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Trash2, 
  Mic, 
  AlertTriangle, 
  Monitor, 
  Send, 
  Plus 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GestureRecorder, { GestureData } from '../gesture/GestureRecorder';
import { useToast } from "@/components/ui/use-toast";

export interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gesture?: GestureData;
}

interface SecurityFeaturesProps {
  onAddGesture: (gesture: GestureData) => void;
}

const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({ onAddGesture }) => {
  const [selectedFeature, setSelectedFeature] = useState<SecurityFeature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const securityFeatures: SecurityFeature[] = [
    {
      id: 'ghost-delete',
      name: 'Ghost Delete',
      description: 'Instantly clear conversations in messaging apps',
      icon: <Trash2 className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'emergency-signal',
      name: 'Emergency Distress Signal',
      description: 'Send pre-set emergency message with live GPS coordinates',
      icon: <Send className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'fake-shutdown',
      name: 'Fake Shutdown',
      description: 'Black out screen while keeping phone running in background',
      icon: <Monitor className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'voice-recording',
      name: 'Silent Recording',
      description: 'Trigger silent audio recording without opening any app',
      icon: <Mic className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'self-destruct',
      name: 'Self-Destruct Mode',
      description: 'Force-reboot and wipe sensitive data',
      icon: <AlertTriangle className="h-6 w-6 text-app-purple" />
    }
  ];

  const handleFeatureSelect = (feature: SecurityFeature) => {
    setSelectedFeature(feature);
    setIsDialogOpen(true);
  };

  const handleGestureRecorded = (gesture: GestureData) => {
    if (selectedFeature) {
      const updatedGesture = {
        ...gesture,
        name: `${selectedFeature.name} Gesture` 
      };
      
      onAddGesture(updatedGesture);
      
      toast({
        title: "Security feature activated",
        description: `${selectedFeature.name} is now ready to use with your gesture`,
      });
      
      setIsDialogOpen(false);
      setSelectedFeature(null);
    }
  };

  const handleCancelRecording = () => {
    setIsDialogOpen(false);
    setSelectedFeature(null);
  };

  return (
    <>
      <Card className="w-full bg-card border-muted">
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            Record gestures to activate security features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature) => (
              <div key={feature.id} className="security-feature-card">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-app-purple/20 flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => handleFeatureSelect(feature)}
                  className="w-full border-dashed border-muted-foreground/50 hover:border-app-purple/50 hover:bg-muted/50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Assign Gesture
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Note: These security features work best when the app is granted proper permissions. 
            Some features may require additional setup in your device settings.
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFeature ? `Record Gesture for ${selectedFeature.name}` : 'Record Gesture'}
            </DialogTitle>
            <DialogDescription>
              Draw a unique gesture pattern that will trigger this security feature
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeature && (
            <GestureRecorder 
              onGestureRecorded={handleGestureRecorded} 
              onCancel={handleCancelRecording}
              gestureName={`${selectedFeature.name} Gesture`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecurityFeatures;
