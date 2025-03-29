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
  X,
  Settings,
  MapPin,
  AppWindow,
  PlayCircle,
  Lock,
  EyeOff,
  UserX
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
import { Textarea } from "@/components/ui/textarea";
import SequenceRecorder, { SequenceData } from '../sequence/SequenceRecorder';

export interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gesture?: GestureData;
  config?: {
    apps?: string[];
    contacts?: string[];
    message?: string;
    includeLocation?: boolean;
    sequence?: SequenceData;
  };
}

interface SecurityFeaturesProps {
  onAddGesture: (gesture: GestureData) => void;
  onAddSequence: (sequence: SequenceData) => void;
  onActivateSequence: (sequenceId: string) => void;
  onGhostDelete: () => void;
  onEmergencySignal: () => void;
  onStartApp: () => void;
  onSilentRecording: () => void;
  onLockUnlock: () => void;
  onHideApps: () => void;
  onHideContacts: () => void;
}

const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({ 
  onAddGesture, 
  onAddSequence,
  onActivateSequence,
  onGhostDelete,
  onEmergencySignal,
  onStartApp,
  onSilentRecording,
  onLockUnlock,
  onHideApps,
  onHideContacts
}) => {
  const [selectedFeature, setSelectedFeature] = useState<SecurityFeature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [isSequenceDialogOpen, setIsSequenceDialogOpen] = useState(false);
  const { toast } = useToast();

  const availableApps = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook-icon' },
    { id: 'instagram', name: 'Instagram', icon: 'instagram-icon' },
    { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp-icon' },
    { id: 'twitter', name: 'Twitter', icon: 'twitter-icon' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin-icon' },
  ];

  const securityFeatures: SecurityFeature[] = [
    {
      id: 'ghost-delete',
      name: 'Ghost Delete',
      description: 'Deletes conversations from selected apps',
      icon: <Trash2 className="h-5 w-5" />,
      config: {
        apps: [],
      },
    },
    {
      id: 'silent-recording',
      name: 'Silent Recording',
      description: 'Starts recording audio in the background',
      icon: <Mic className="h-5 w-5" />,
    },
    {
      id: 'emergency-signal',
      name: 'Emergency Signal',
      description: 'Sends an emergency signal to selected contacts',
      icon: <AlertTriangle className="h-5 w-5" />,
      config: {
        contacts: [],
        message: 'I am in danger. Please help!',
        includeLocation: true,
      },
    },
    {
      id: 'app-monitoring',
      name: 'App Monitoring',
      description: 'Monitors selected apps for suspicious activity',
      icon: <Monitor className="h-5 w-5" />,
      config: {
        apps: [],
      },
    },
    {
      id: 'start-app',
      name: 'Start App',
      description: 'Starts a selected app',
      icon: <AppWindow className="h-5 w-5" />,
      config: {
        apps: [],
      },
    },
    {
      id: 'lock-unlock',
      name: 'Lock/Unlock Phone',
      description: 'Locks or unlocks the phone with a gesture',
      icon: <Lock className="h-5 w-5" />,
    },
    {
      id: 'hide-apps',
      name: 'Hide Apps',
      description: 'Hides selected apps from the home screen',
      icon: <EyeOff className="h-5 w-5" />,
      config: {
        apps: [],
      },
    },
    {
      id: 'hide-contacts',
      name: 'Hide Contacts',
      description: 'Hides selected contacts from the contacts list',
      icon: <UserX className="h-5 w-5" />,
      config: {
        contacts: [],
      },
    },
    {
      id: 'sequence-automation',
      name: 'Sequence Automation',
      description: 'Automate a sequence of actions with a gesture',
      icon: <PlayCircle className="h-5 w-5" />,
      config: {
        sequence: undefined,
      },
    },
  ];

  const handleFeatureSelect = (feature: SecurityFeature) => {
    setSelectedFeature(feature);
    setIsDialogOpen(true);
  };

  const handleFeatureDemo = (feature: SecurityFeature) => {
    if (feature.id === 'ghost-delete') {
      onGhostDelete();
    } else if (feature.id === 'emergency-signal') {
      onEmergencySignal();
    } else if (feature.id === 'start-app') {
      onStartApp();
    } else if (feature.id === 'silent-recording') {
      onSilentRecording();
    } else if (feature.id === 'lock-unlock') {
      onLockUnlock();
    } else if (feature.id === 'hide-apps') {
      onHideApps();
    } else if (feature.id === 'hide-contacts') {
      onHideContacts();
    }
    setIsDialogOpen(false);
  };

  const handleGestureRecorded = (gesture: GestureData) => {
    if (selectedFeature) {
      if (selectedFeature.id === 'ghost-delete') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Ghost Delete",
        });
      } else if (selectedFeature.id === 'emergency-signal') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Emergency Signal",
        });
      } else if (selectedFeature.id === 'start-app') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Start App",
        });
      } else if (selectedFeature.id === 'silent-recording') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Silent Recording",
        });
      } else if (selectedFeature.id === 'lock-unlock') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Lock/Unlock",
        });
      } else if (selectedFeature.id === 'hide-apps') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Hide Apps",
        });
      } else if (selectedFeature.id === 'hide-contacts') {
        onAddGesture(gesture);
        toast({
          title: "Gesture Assigned",
          description: "Gesture assigned to Hide Contacts",
        });
      }
    }
    setIsDialogOpen(false);
  };

  const handleCancelRecording = () => {
    setIsDialogOpen(false);
  };

  const handleAddContact = () => {
    if (newContactName) {
      setSelectedContacts(prev => [...prev, newContactName]);
      setNewContactName('');
    }
  };

  const handleRemoveContact = (contact: string) => {
    setSelectedContacts(prev => prev.filter(c => c !== contact));
  };

  const handleToggleApp = (appId: string) => {
    setSelectedApps(prev => {
      if (prev.includes(appId)) {
        return prev.filter(id => id !== appId);
      } else {
        return [...prev, appId];
      }
    });
  };

  const handleConfigureGhostDelete = () => {
    if (selectedFeature && selectedFeature.id === 'ghost-delete') {
      setIsConfigOpen(true);
      setSelectedApps(selectedFeature.config?.apps || []);
    }
  };

  const handleConfigureEmergencySignal = () => {
    if (selectedFeature && selectedFeature.id === 'emergency-signal') {
      setIsConfigOpen(true);
      setSelectedContacts(selectedFeature.config?.contacts || []);
      setEmergencyMessage(selectedFeature.config?.message || '');
      setIncludeLocation(selectedFeature.config?.includeLocation || true);
    }
  };

  const handleConfigureStartApp = () => {
    if (selectedFeature && selectedFeature.id === 'start-app') {
      setIsConfigOpen(true);
      setSelectedApps(selectedFeature.config?.apps || []);
    }
  };

  const handleConfigureHideApps = () => {
    if (selectedFeature && selectedFeature.id === 'hide-apps') {
      setIsConfigOpen(true);
      setSelectedApps(selectedFeature.config?.apps || []);
    }
  };

  const handleConfigureHideContacts = () => {
    if (selectedFeature && selectedFeature.id === 'hide-contacts') {
      setIsConfigOpen(true);
      setSelectedContacts(selectedFeature.config?.contacts || []);
    }
  };

  const handleSaveConfig = () => {
    if (selectedFeature) {
      if (selectedFeature.id === 'ghost-delete') {
        selectedFeature.config = { apps: selectedApps };
      } else if (selectedFeature.id === 'emergency-signal') {
        selectedFeature.config = { 
          contacts: selectedContacts, 
          message: emergencyMessage,
          includeLocation: includeLocation,
        };
      } else if (selectedFeature.id === 'start-app') {
        selectedFeature.config = { apps: selectedApps };
      } else if (selectedFeature.id === 'hide-apps') {
        selectedFeature.config = { apps: selectedApps };
      } else if (selectedFeature.id === 'hide-contacts') {
        selectedFeature.config = { contacts: selectedContacts };
      }
    }
    setIsConfigOpen(false);
    toast({
      title: "Configuration Saved",
      description: "Configuration saved successfully.",
    });
  };

  const handleConfigureSequence = () => {
    setSelectedFeature({
      id: 'sequence-automation',
      name: 'Sequence Automation',
      description: 'Automate a sequence of actions with a gesture',
      icon: <PlayCircle className="h-5 w-5" />,
      config: {
        sequence: undefined,
      },
    });
    setIsSequenceDialogOpen(true);
  };

  const handleSequenceRecorded = (sequence: SequenceData) => {
    if (selectedFeature && selectedFeature.id === 'sequence-automation') {
      selectedFeature.config = { sequence: sequence };
      onAddSequence(sequence);
      toast({
        title: "Sequence Assigned",
        description: "Sequence assigned to Sequence Automation",
      });
    }
    setIsSequenceDialogOpen(false);
  };

  const handleCancelSequence = () => {
    setIsSequenceDialogOpen(false);
  };

  const getConfigButton = (feature: SecurityFeature) => {
    if (feature.id === 'ghost-delete') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureGhostDelete}
          className="w-full"
        >
          Configure Apps
        </Button>
      );
    } else if (feature.id === 'emergency-signal') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureEmergencySignal}
          className="w-full"
        >
          Configure Signal
        </Button>
      );
    } else if (feature.id === 'start-app') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureStartApp}
          className="w-full"
        >
          Configure App
        </Button>
      );
    } else if (feature.id === 'hide-apps') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureHideApps}
          className="w-full"
        >
          Configure Apps
        </Button>
      );
    } else if (feature.id === 'hide-contacts') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureHideContacts}
          className="w-full"
        >
          Configure Contacts
        </Button>
      );
    } else if (feature.id === 'sequence-automation') {
      return (
        <Button 
          variant="secondary" 
          onClick={handleConfigureSequence}
          className="w-full"
        >
          Configure Sequence
        </Button>
      );
    }
    return null;
  };

  const getDemoButton = (feature: SecurityFeature) => {
    if (feature.id === 'ghost-delete' || feature.id === 'emergency-signal' || feature.id === 'start-app' || feature.id === 'silent-recording' || feature.id === 'lock-unlock' || feature.id === 'hide-apps' || feature.id === 'hide-contacts') {
      return (
        <Button 
          variant="default" 
          onClick={() => handleFeatureDemo(feature)}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Demo Feature
        </Button>
      );
    }
    return null;
  };

  const handleStartSequenceForFeature = (feature: SecurityFeature) => {
    if (feature.id === 'sequence-automation' && feature.config?.sequence) {
      onActivateSequence(feature.config.sequence.id);
    }
  };

  const renderConfigDialog = () => {
    if (!selectedFeature) return null;

    if (selectedFeature.id === 'ghost-delete') {
      return (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Ghost Delete</DialogTitle>
              <DialogDescription>
                Select the apps to clear conversations from.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {availableApps.map((app) => (
                <div key={app.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={app.id}
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => handleToggleApp(app.id)}
                  />
                  <Label htmlFor={app.id}>{app.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-app-purple hover:bg-app-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (selectedFeature.id === 'emergency-signal') {
      return (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Emergency Signal</DialogTitle>
              <DialogDescription>
                Set up the emergency signal message and contacts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-message">Message</Label>
                <Textarea
                  id="emergency-message"
                  value={emergencyMessage}
                  onChange={(e) => setEmergencyMessage(e.target.value)}
                  placeholder="Enter emergency message"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-location"
                  checked={includeLocation}
                  onCheckedChange={() => setIncludeLocation(!includeLocation)}
                />
                <Label htmlFor="include-location">Include Location</Label>
              </div>
              <div className="space-y-2">
                <Label>Contacts</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter contact name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                  <Button type="button" size="sm" onClick={handleAddContact}>
                    Add Contact
                  </Button>
                </div>
                {selectedContacts.length > 0 && (
                  <div className="mt-2">
                    {selectedContacts.map((contact) => (
                      <div key={contact} className="flex items-center justify-between py-1 px-2 rounded-md bg-muted">
                        <span>{contact}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveContact(contact)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-app-purple hover:bg-app-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (selectedFeature.id === 'start-app') {
      return (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Start App</DialogTitle>
              <DialogDescription>
                Select the app to start.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {availableApps.map((app) => (
                <div key={app.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={app.id}
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => handleToggleApp(app.id)}
                  />
                  <Label htmlFor={app.id}>{app.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-app-purple hover:bg-app-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (selectedFeature.id === 'hide-apps') {
      return (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Hide Apps</DialogTitle>
              <DialogDescription>
                Select the apps to hide.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {availableApps.map((app) => (
                <div key={app.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={app.id}
                    checked={selectedApps.includes(app.id)}
                    onCheckedChange={() => handleToggleApp(app.id)}
                  />
                  <Label htmlFor={app.id}>{app.name}</Label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-app-purple hover:bg-app-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    } else if (selectedFeature.id === 'hide-contacts') {
      return (
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Hide Contacts</DialogTitle>
              <DialogDescription>
                Select the contacts to hide.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Contacts</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter contact name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                  />
                  <Button type="button" size="sm" onClick={handleAddContact}>
                    Add Contact
                  </Button>
                </div>
                {selectedContacts.length > 0 && (
                  <div className="mt-2">
                    {selectedContacts.map((contact) => (
                      <div key={contact} className="flex items-center justify-between py-1 px-2 rounded-md bg-muted">
                        <span>{contact}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveContact(contact)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig} className="bg-app-purple hover:bg-app-purple/90">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return null;
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
                <div className="flex items-center space-x-3 mb-3">
                  {feature.icon}
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFeatureSelect(feature)}
                    className="w-full border-dashed border-muted-foreground/50 hover:border-app-purple/50 hover:bg-muted/50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Assign Gesture
                  </Button>
                  
                  {getConfigButton(feature)}
                  {getDemoButton(feature)}
                  
                  {feature.id === 'sequence-automation' && feature.config?.sequence && (
                    <Button 
                      variant="default" 
                      onClick={() => handleStartSequenceForFeature(feature)}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Sequence
                    </Button>
                  )}
                </div>
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

      <Dialog open={isDialogOpen && selectedFeature !== null} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Gesture</DialogTitle>
            <DialogDescription>
              Draw a unique gesture pattern that will be saved to your library
            </DialogDescription>
          </DialogHeader>
          <GestureRecorder 
            onGestureRecorded={handleGestureRecorded} 
            onCancel={handleCancelRecording}
            gestureName={selectedFeature?.name || "Custom Gesture"} 
          />
        </DialogContent>
      </Dialog>

      {renderConfigDialog()}

      <Dialog open={isSequenceDialogOpen} onOpenChange={setIsSequenceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Sequence</DialogTitle>
            <DialogDescription>
              Create a sequence of actions to automate.
            </DialogDescription>
          </DialogHeader>
          <SequenceRecorder 
            onSequenceRecorded={handleSequenceRecorded} 
            onCancel={handleCancelSequence}
            sequenceName="Custom Sequence" 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecurityFeatures;
