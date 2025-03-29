
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
  Plus,
  X 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import GestureRecorder, { GestureData } from '../gesture/GestureRecorder';
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gesture?: GestureData;
  config?: {
    apps?: string[];
    contacts?: string[];
  };
}

interface SecurityFeaturesProps {
  onAddGesture: (gesture: GestureData) => void;
}

const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({ onAddGesture }) => {
  const [selectedFeature, setSelectedFeature] = useState<SecurityFeature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { toast } = useToast();

  const availableApps = [
    { id: 'whatsapp', name: 'WhatsApp' },
    { id: 'messenger', name: 'Messenger' },
    { id: 'telegram', name: 'Telegram' },
    { id: 'signal', name: 'Signal' },
    { id: 'sms', name: 'SMS' }
  ];

  // Create a locally mutable copy of security features
  const [securityFeatures, setSecurityFeatures] = useState<SecurityFeature[]>([
    {
      id: 'ghost-delete',
      name: 'Ghost Delete',
      description: 'Instantly clear conversations in messaging apps',
      icon: <Trash2 className="h-6 w-6 text-app-purple" />,
      config: {
        apps: [],
        contacts: []
      }
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
  ]);

  const handleFeatureSelect = (feature: SecurityFeature) => {
    setSelectedFeature(feature);
    
    // If it's the Ghost Delete feature, open config dialog first
    if (feature.id === 'ghost-delete') {
      // Initialize selections with current config if it exists
      const ghostDeleteFeature = securityFeatures.find(f => f.id === 'ghost-delete');
      setSelectedApps(ghostDeleteFeature?.config?.apps || []);
      setSelectedContacts(ghostDeleteFeature?.config?.contacts || []);
      setIsConfigOpen(true);
    } else {
      // For other features, go straight to gesture recording
      setIsDialogOpen(true);
    }
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

  const handleAddContact = () => {
    if (newContactName.trim() && !selectedContacts.includes(newContactName.trim())) {
      setSelectedContacts([...selectedContacts, newContactName.trim()]);
      setNewContactName('');
    }
  };

  const handleRemoveContact = (contact: string) => {
    setSelectedContacts(selectedContacts.filter(c => c !== contact));
  };

  const handleToggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

  const handleSaveConfig = () => {
    if (selectedFeature && selectedFeature.id === 'ghost-delete') {
      // Update the feature in state with the new config
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'ghost-delete') {
          return {
            ...feature,
            config: {
              apps: selectedApps,
              contacts: selectedContacts
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      // Now proceed to gesture recording
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Ghost Delete configured",
        description: `Will delete conversations from ${selectedContacts.length} contacts across ${selectedApps.length} apps`,
      });
    }
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
              <div key={feature.id} className="security-feature-card border rounded-lg p-4">
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-app-purple/20 flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.id === 'ghost-delete' && feature.config?.contacts && feature.config.contacts.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.contacts.length} contacts, {feature.config.apps?.length || 0} apps configured
                        </p>
                      </div>
                    )}
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

      {/* Ghost Delete Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={(open) => {
        setIsConfigOpen(open);
        if (!open) setSelectedFeature(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Ghost Delete</DialogTitle>
            <DialogDescription>
              Select which apps and contacts you want to include in the Ghost Delete feature
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <h3 className="mb-2 text-sm font-medium">Select Apps</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableApps.map(app => (
                  <div key={app.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`app-${app.id}`} 
                      checked={selectedApps.includes(app.id)}
                      onCheckedChange={() => handleToggleApp(app.id)}
                    />
                    <Label 
                      htmlFor={`app-${app.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {app.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="mb-2 text-sm font-medium">Add Contacts</h3>
              <div className="flex mb-2">
                <Input
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Contact name"
                  className="mr-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddContact();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddContact} size="sm">Add</Button>
              </div>
              
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedContacts.map(contact => (
                    <div key={contact} className="flex items-center bg-muted px-2 py-1 rounded text-sm">
                      {contact}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-1 ml-1"
                        onClick={() => handleRemoveContact(contact)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setIsConfigOpen(false);
              setSelectedFeature(null);
            }}>Cancel</Button>
            <Button onClick={handleSaveConfig}>Save & Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gesture Recording Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedFeature(null);
      }}>
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
