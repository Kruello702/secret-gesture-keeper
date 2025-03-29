
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
    { id: 'whatsapp', name: 'WhatsApp' },
    { id: 'messenger', name: 'Messenger' },
    { id: 'telegram', name: 'Telegram' },
    { id: 'signal', name: 'Signal' },
    { id: 'sms', name: 'SMS' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' }
  ];

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
      icon: <Send className="h-6 w-6 text-app-purple" />,
      config: {
        contacts: [],
        message: "I'm in an emergency situation and need help.",
        includeLocation: true
      }
    },
    {
      id: 'start-app',
      name: 'Start an App',
      description: 'Quickly launch a pre-selected app with a gesture',
      icon: <AppWindow className="h-6 w-6 text-app-purple" />,
      config: {
        apps: [] 
      }
    },
    {
      id: 'voice-recording',
      name: 'Silent Recording',
      description: 'Trigger silent audio recording without opening any app',
      icon: <Mic className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'lock-unlock',
      name: 'Lock/Unlock Phone',
      description: 'Quickly lock or unlock your device with a gesture',
      icon: <Lock className="h-6 w-6 text-app-purple" />
    },
    {
      id: 'sequence-automation',
      name: 'Start a Sequence',
      description: 'Automate button presses, swipes, or taps with a floating bubble',
      icon: <PlayCircle className="h-6 w-6 text-app-purple" />,
      config: {
        sequence: undefined
      }
    },
    {
      id: 'hide-apps',
      name: 'Hide Apps',
      description: 'Quickly hide selected apps from your home screen',
      icon: <EyeOff className="h-6 w-6 text-app-purple" />,
      config: {
        apps: []
      }
    },
    {
      id: 'hide-contacts',
      name: 'Hide Contacts',
      description: 'Temporarily hide specific contacts from your contacts list',
      icon: <UserX className="h-6 w-6 text-app-purple" />,
      config: {
        contacts: []
      }
    }
  ]);

  const handleFeatureSelect = (feature: SecurityFeature) => {
    setSelectedFeature(feature);
    
    if (feature.id === 'ghost-delete') {
      const ghostDeleteFeature = securityFeatures.find(f => f.id === 'ghost-delete');
      setSelectedApps(ghostDeleteFeature?.config?.apps || []);
      setSelectedContacts(ghostDeleteFeature?.config?.contacts || []);
      setIsConfigOpen(true);
    } else if (feature.id === 'emergency-signal') {
      const emergencyFeature = securityFeatures.find(f => f.id === 'emergency-signal');
      setSelectedContacts(emergencyFeature?.config?.contacts || []);
      setEmergencyMessage(emergencyFeature?.config?.message || "I'm in an emergency situation and need help.");
      setIncludeLocation(emergencyFeature?.config?.includeLocation !== false);
      setIsConfigOpen(true);
    } else if (feature.id === 'start-app') {
      const startAppFeature = securityFeatures.find(f => f.id === 'start-app');
      setSelectedApps(startAppFeature?.config?.apps || []);
      setIsConfigOpen(true);
    } else if (feature.id === 'hide-apps') {
      const hideAppsFeature = securityFeatures.find(f => f.id === 'hide-apps');
      setSelectedApps(hideAppsFeature?.config?.apps || []);
      setIsConfigOpen(true);
    } else if (feature.id === 'hide-contacts') {
      const hideContactsFeature = securityFeatures.find(f => f.id === 'hide-contacts');
      setSelectedContacts(hideContactsFeature?.config?.contacts || []);
      setIsConfigOpen(true);
    } else if (feature.id === 'sequence-automation') {
      setIsSequenceDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleFeatureDemo = (feature: SecurityFeature) => {
    if (feature.id === 'ghost-delete') {
      onGhostDelete();
    } else if (feature.id === 'emergency-signal') {
      onEmergencySignal();
    } else if (feature.id === 'start-app') {
      onStartApp();
    } else if (feature.id === 'voice-recording') {
      onSilentRecording();
    } else if (feature.id === 'lock-unlock') {
      onLockUnlock();
    } else if (feature.id === 'sequence-automation' && feature.config?.sequence) {
      onActivateSequence(feature.config.sequence.id);
    } else if (feature.id === 'hide-apps') {
      onHideApps();
    } else if (feature.id === 'hide-contacts') {
      onHideContacts();
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

  const handleConfigureGhostDelete = () => {
    const ghostDeleteFeature = securityFeatures.find(f => f.id === 'ghost-delete');
    if (ghostDeleteFeature) {
      setSelectedFeature(ghostDeleteFeature);
      setSelectedApps(ghostDeleteFeature.config?.apps || []);
      setSelectedContacts(ghostDeleteFeature.config?.contacts || []);
      setIsConfigOpen(true);
    }
  };

  const handleConfigureEmergencySignal = () => {
    const emergencyFeature = securityFeatures.find(f => f.id === 'emergency-signal');
    if (emergencyFeature) {
      setSelectedFeature(emergencyFeature);
      setSelectedContacts(emergencyFeature.config?.contacts || []);
      setEmergencyMessage(emergencyFeature.config?.message || "I'm in an emergency situation and need help.");
      setIncludeLocation(emergencyFeature.config?.includeLocation !== false);
      setIsConfigOpen(true);
    }
  };

  const handleConfigureStartApp = () => {
    const startAppFeature = securityFeatures.find(f => f.id === 'start-app');
    if (startAppFeature) {
      setSelectedFeature(startAppFeature);
      setSelectedApps(startAppFeature.config?.apps || []);
      setIsConfigOpen(true);
    }
  };

  const handleConfigureHideApps = () => {
    const hideAppsFeature = securityFeatures.find(f => f.id === 'hide-apps');
    if (hideAppsFeature) {
      setSelectedFeature(hideAppsFeature);
      setSelectedApps(hideAppsFeature.config?.apps || []);
      setIsConfigOpen(true);
    }
  };

  const handleConfigureHideContacts = () => {
    const hideContactsFeature = securityFeatures.find(f => f.id === 'hide-contacts');
    if (hideContactsFeature) {
      setSelectedFeature(hideContactsFeature);
      setSelectedContacts(hideContactsFeature.config?.contacts || []);
      setIsConfigOpen(true);
    }
  };

  const handleSaveConfig = () => {
    if (!selectedFeature) return;
    
    if (selectedFeature.id === 'ghost-delete') {
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
      
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Ghost Delete configured",
        description: `Will delete conversations from ${selectedContacts.length} contacts across ${selectedApps.length} apps`,
      });
    } else if (selectedFeature.id === 'emergency-signal') {
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'emergency-signal') {
          return {
            ...feature,
            config: {
              contacts: selectedContacts,
              message: emergencyMessage,
              includeLocation: includeLocation
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Emergency Signal configured",
        description: `Will send alert to ${selectedContacts.length} contacts${includeLocation ? ' with location' : ''}`,
      });
    } else if (selectedFeature.id === 'start-app') {
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'start-app') {
          return {
            ...feature,
            config: {
              apps: selectedApps
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Start an App configured",
        description: `Will launch ${selectedApps.length} app(s) with a gesture`,
      });
    } else if (selectedFeature.id === 'hide-apps') {
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'hide-apps') {
          return {
            ...feature,
            config: {
              apps: selectedApps
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Hide Apps configured",
        description: `Will hide ${selectedApps.length} app(s) with a gesture`,
      });
    } else if (selectedFeature.id === 'hide-contacts') {
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'hide-contacts') {
          return {
            ...feature,
            config: {
              contacts: selectedContacts
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      setIsConfigOpen(false);
      setIsDialogOpen(true);
      
      toast({
        title: "Hide Contacts configured",
        description: `Will hide ${selectedContacts.length} contact(s) with a gesture`,
      });
    }
  };

  const handleConfigureSequence = () => {
    const sequenceFeature = securityFeatures.find(f => f.id === 'sequence-automation');
    if (sequenceFeature) {
      setSelectedFeature(sequenceFeature);
      setIsSequenceDialogOpen(true);
    }
  };

  const handleSequenceRecorded = (sequence: SequenceData) => {
    if (selectedFeature && selectedFeature.id === 'sequence-automation') {
      const updatedFeatures = securityFeatures.map(feature => {
        if (feature.id === 'sequence-automation') {
          return {
            ...feature,
            config: {
              ...feature.config,
              sequence: sequence
            }
          };
        }
        return feature;
      });
      
      setSecurityFeatures(updatedFeatures);
      
      onAddSequence(sequence);
      
      toast({
        title: "Sequence created",
        description: `${sequence.name} has been configured for the security feature`,
      });
      
      setIsSequenceDialogOpen(false);
      setSelectedFeature(null);
    }
  };

  const handleCancelSequence = () => {
    setIsSequenceDialogOpen(false);
    setSelectedFeature(null);
  };

  const getConfigButton = (feature: SecurityFeature) => {
    if (feature.id === 'ghost-delete') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureGhostDelete()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Add App and Contacts
        </Button>
      );
    } else if (feature.id === 'emergency-signal') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureEmergencySignal()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Set Message and Contacts
        </Button>
      );
    } else if (feature.id === 'start-app') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureStartApp()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Select Apps to Start
        </Button>
      );
    } else if (feature.id === 'sequence-automation') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureSequence()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Configure Sequence
        </Button>
      );
    } else if (feature.id === 'lock-unlock') {
      return (
        <Button 
          variant="outline" 
          className="w-full bg-muted/20 hover:bg-muted/30"
          disabled={true}
        >
          <Settings className="mr-2 h-4 w-4" />
          No configuration needed
        </Button>
      );
    } else if (feature.id === 'hide-apps') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureHideApps()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Select Apps to Hide
        </Button>
      );
    } else if (feature.id === 'hide-contacts') {
      return (
        <Button 
          variant="outline" 
          onClick={() => handleConfigureHideContacts()}
          className="w-full bg-muted/20 hover:bg-muted/30"
        >
          <Settings className="mr-2 h-4 w-4" />
          Select Contacts to Hide
        </Button>
      );
    }
    return null;
  };

  const getDemoButton = (feature: SecurityFeature) => {
    const buttonText = feature.id === 'sequence-automation' ? 'Run Sequence' : 
                      feature.id === 'ghost-delete' ? 'Demo Delete' :
                      feature.id === 'emergency-signal' ? 'Demo Emergency' :
                      feature.id === 'lock-unlock' ? 'Demo Lock/Unlock' :
                      feature.id === 'hide-apps' ? 'Demo Hide Apps' :
                      feature.id === 'hide-contacts' ? 'Demo Hide Contacts' :
                      'Demo Feature';
    
    // Only show demo button if the feature has a configuration (or doesn't need one like lock/unlock)
    const hasConfigured = feature.id === 'lock-unlock' || 
                         (feature.id === 'sequence-automation' && feature.config?.sequence) ||
                         (feature.id === 'ghost-delete' && (feature.config?.apps?.length || feature.config?.contacts?.length)) ||
                         (feature.id === 'emergency-signal' && feature.config?.contacts?.length) ||
                         (feature.id === 'start-app' && feature.config?.apps?.length) ||
                         (feature.id === 'hide-apps' && feature.config?.apps?.length) ||
                         (feature.id === 'hide-contacts' && feature.config?.contacts?.length) ||
                         (feature.id === 'voice-recording');
    
    if (hasConfigured) {
      return (
        <Button 
          variant="default" 
          onClick={() => handleFeatureDemo(feature)}
          className="w-full bg-app-purple/80 hover:bg-app-purple"
          size="sm"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      );
    }
    
    return null;
  };

  const renderConfigDialog = () => {
    if (!selectedFeature) return null;

    if (selectedFeature.id === 'ghost-delete') {
      return (
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
      );
    } else if (selectedFeature.id === 'emergency-signal') {
      return (
        <div className="space-y-4 py-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Emergency Message</h3>
            <Textarea
              value={emergencyMessage}
              onChange={(e) => setEmergencyMessage(e.target.value)}
              placeholder="Enter your emergency message"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-location" 
              checked={includeLocation}
              onCheckedChange={(checked) => setIncludeLocation(checked === true)}
            />
            <Label 
              htmlFor="include-location"
              className="text-sm font-medium leading-none cursor-pointer flex items-center"
            >
              Include my current location <MapPin className="ml-1 h-3 w-3 text-app-purple" />
            </Label>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="mb-2 text-sm font-medium">Emergency Contacts</h3>
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
      );
    } else if (selectedFeature.id === 'start-app') {
      return (
        <div className="space-y-4 py-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Select Apps to Start</h3>
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
        </div>
      );
    } else if (selectedFeature.id === 'hide-apps') {
      return (
        <div className="space-y-4 py-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Select Apps to Hide</h3>
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
        </div>
      );
    } else if (selectedFeature.id === 'hide-contacts') {
      return (
        <div className="space-y-4 py-2">
          <h3 className="mb-2 text-sm font-medium">Add Contacts to Hide</h3>
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
                <div className="flex items-start mb-4">
                  <div className="h-10 w-10 rounded-full bg-app-purple/20 flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    {feature.id === 'ghost-delete' && feature.config && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.contacts?.length || 0} contacts, {feature.config.apps?.length || 0} apps configured
                        </p>
                      </div>
                    )}
                    {feature.id === 'emergency-signal' && feature.config && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.contacts?.length || 0} emergency contacts configured
                          {feature.config.includeLocation && ' • Location sharing enabled'}
                        </p>
                      </div>
                    )}
                    {feature.id === 'start-app' && feature.config && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.apps?.length || 0} apps selected to start
                        </p>
                      </div>
                    )}
                    {feature.id === 'hide-apps' && feature.config && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.apps?.length || 0} apps selected to hide
                        </p>
                      </div>
                    )}
                    {feature.id === 'hide-contacts' && feature.config && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          {feature.config.contacts?.length || 0} contacts selected to hide
                        </p>
                      </div>
                    )}
                    {feature.id === 'sequence-automation' && feature.config && feature.config.sequence && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Sequence: {feature.config.sequence.name} • {feature.config.sequence.points.length} actions
                          {feature.config.sequence.timerEnabled && ` • Timer: ${feature.config.sequence.timerDelay} min`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
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

      <Dialog open={isConfigOpen} onOpenChange={(open) => {
        setIsConfigOpen(open);
        if (!open) setSelectedFeature(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedFeature?.id === 'ghost-delete' ? 'Configure Ghost Delete' : 
               selectedFeature?.id === 'emergency-signal' ? 'Configure Emergency Signal' : 
               selectedFeature?.id === 'start-app' ? 'Configure Start an App' :
               selectedFeature?.id === 'lock-unlock' ? 'Configure Lock/Unlock Phone' :
               selectedFeature?.id === 'hide-apps' ? 'Configure Hide Apps' :
               selectedFeature?.id === 'hide-contacts' ? 'Configure Hide Contacts' :
               'Configure Feature'}
            </DialogTitle>
            <DialogDescription>
              {selectedFeature?.id === 'ghost-delete' ? 
                'Select which apps and contacts you want to include in the Ghost Delete feature' : 
               selectedFeature?.id === 'emergency-signal' ? 
                'Configure your emergency message and contacts' : 
               selectedFeature?.id === 'start-app' ?
                'Select which apps you want to start with a gesture' :
               selectedFeature?.id === 'lock-unlock' ?
                'No configuration needed' :
               selectedFeature?.id === 'hide-apps' ?
                'Select which apps you want to hide with a gesture' :
               selectedFeature?.id === 'hide-contacts' ?
                'Select which contacts you want to hide with a gesture' :
                'Configure this security feature'}
            </DialogDescription>
          </DialogHeader>
          
          {renderConfigDialog()}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => {
              setIsConfigOpen(false);
              setSelectedFeature(null);
            }}>Cancel</Button>
            <Button onClick={handleSaveConfig}>Save & Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setSelectedFeature(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedFeature ? `Record Gesture for ${selectedFeature.name}` : 'Record Gesture'}</DialogTitle>
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

      <Dialog open={isSequenceDialogOpen} onOpenChange={(open) => {
        setIsSequenceDialogOpen(open);
        if (!open) setSelectedFeature(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Automation Sequence</DialogTitle>
            <DialogDescription>
              Record a sequence of taps, double-taps, and swipes to automate interactions
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeature && (
            <SequenceRecorder 
              onSequenceRecorded={handleSequenceRecorded} 
              onCancel={handleCancelSequence}
              sequenceName={selectedFeature.config?.sequence?.name || "New Sequence"}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SecurityFeatures;
