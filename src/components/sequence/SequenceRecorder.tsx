import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Hand, 
  MousePointer, 
  MousePointerClick,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SequencePoint {
  id: string;
  type: 'tap' | 'double-tap' | 'swipe';
  position: { x: number; y: number };
  targetPosition?: { x: number; y: number }; // For swipe endpoint
  delay?: number; // Delay before this action in ms
}

export interface SequenceData {
  id: string;
  name: string;
  points: SequencePoint[];
  timerEnabled: boolean;
  timerDelay?: number; // Delay in minutes
  createdAt?: string; // Added createdAt property
}

interface SequenceRecorderProps {
  onSequenceRecorded: (sequence: SequenceData) => void;
  onCancel: () => void;
  sequenceName?: string;
}

const SequenceRecorder: React.FC<SequenceRecorderProps> = ({
  onSequenceRecorded,
  onCancel,
  sequenceName = 'New Sequence'
}) => {
  const [name, setName] = useState(sequenceName);
  const [recording, setRecording] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<'tap' | 'double-tap' | 'swipe'>('tap');
  const [points, setPoints] = useState<SequencePoint[]>([]);
  const [currentSwipeStart, setCurrentSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDelay, setTimerDelay] = useState(5); // Default 5 minutes
  
  const recorderRef = useRef<HTMLDivElement>(null);
  
  const startRecording = () => {
    setRecording(true);
    setPoints([]);
  };
  
  const stopRecording = () => {
    setRecording(false);
  };
  
  const handleAddPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!recording) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentActionType === 'swipe') {
      if (currentSwipeStart) {
        // Finish swipe
        const newPoint: SequencePoint = {
          id: `point-${Date.now()}`,
          type: 'swipe',
          position: currentSwipeStart,
          targetPosition: { x, y }
        };
        setPoints(prev => [...prev, newPoint]);
        setCurrentSwipeStart(null);
      } else {
        // Start swipe
        setCurrentSwipeStart({ x, y });
      }
    } else {
      // Handle tap or double-tap
      const newPoint: SequencePoint = {
        id: `point-${Date.now()}`,
        type: currentActionType,
        position: { x, y }
      };
      setPoints(prev => [...prev, newPoint]);
    }
  };
  
  const handleSave = () => {
    const sequence: SequenceData = {
      id: `sequence-${Date.now()}`,
      name: name || 'Unnamed Sequence',
      points,
      timerEnabled,
      timerDelay: timerEnabled ? timerDelay : undefined,
      createdAt: new Date().toISOString()
    };
    onSequenceRecorded(sequence);
  };
  
  const handleRemovePoint = (id: string) => {
    setPoints(prev => prev.filter(point => point.id !== id));
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sequence-name">Sequence Name</Label>
        <Input
          id="sequence-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter sequence name"
        />
      </div>
      
      <div className="flex flex-col">
        <Label className="mb-2">Enable Timer</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enable-timer"
            checked={timerEnabled}
            onChange={(e) => setTimerEnabled(e.target.checked)}
            className="rounded border-gray-300 text-app-purple focus:ring-app-purple"
          />
          <Label htmlFor="enable-timer" className="cursor-pointer">Activate sequence on timer</Label>
        </div>
        
        {timerEnabled && (
          <div className="mt-2">
            <Label htmlFor="timer-delay">Delay (minutes)</Label>
            <Input
              id="timer-delay"
              type="number"
              min={1}
              value={timerDelay}
              onChange={(e) => setTimerDelay(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        )}
      </div>
      
      <div className="rounded-lg border border-dashed p-2">
        <div className="flex space-x-2 mb-3">
          <Button
            type="button"
            size="sm"
            variant={currentActionType === 'tap' ? 'default' : 'outline'}
            onClick={() => setCurrentActionType('tap')}
            className={currentActionType === 'tap' ? 'bg-app-purple' : ''}
          >
            <MousePointer className="h-4 w-4 mr-1" />
            Tap
          </Button>
          <Button
            type="button"
            size="sm"
            variant={currentActionType === 'double-tap' ? 'default' : 'outline'}
            onClick={() => setCurrentActionType('double-tap')}
            className={currentActionType === 'double-tap' ? 'bg-app-purple' : ''}
          >
            <MousePointerClick className="h-4 w-4 mr-1" />
            Double Tap
          </Button>
          <Button
            type="button"
            size="sm"
            variant={currentActionType === 'swipe' ? 'default' : 'outline'}
            onClick={() => setCurrentActionType('swipe')}
            className={currentActionType === 'swipe' ? 'bg-app-purple' : ''}
          >
            <Hand className="h-4 w-4 mr-1" />
            Swipe
          </Button>
        </div>
        
        <div className="flex justify-between mb-2">
          <Button
            type="button"
            size="sm"
            variant={recording ? 'destructive' : 'default'}
            onClick={recording ? stopRecording : startRecording}
            className={recording ? '' : 'bg-app-purple'}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </div>
        
        <div
          ref={recorderRef}
          className={cn(
            "w-full h-60 bg-black/10 rounded-md relative overflow-hidden cursor-crosshair",
            recording ? "border-2 border-app-purple" : "border border-dashed"
          )}
          onClick={handleAddPoint}
        >
          {recording && currentSwipeStart && (
            <div 
              className="absolute w-4 h-4 bg-app-purple/70 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left: currentSwipeStart.x,
                top: currentSwipeStart.y
              }}
            />
          )}
          
          {points.map((point, index) => (
            <React.Fragment key={point.id}>
              {/* Point marker */}
              <div 
                className="absolute flex items-center justify-center w-6 h-6 bg-app-purple/80 rounded-full -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold"
                style={{
                  left: point.position.x,
                  top: point.position.y
                }}
              >
                {index + 1}
                <button 
                  className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-4 h-4 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePoint(point.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              {/* Swipe line if applicable */}
              {point.type === 'swipe' && point.targetPosition && (
                <svg 
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                >
                  <line
                    x1={point.position.x}
                    y1={point.position.y}
                    x2={point.targetPosition.x}
                    y2={point.targetPosition.y}
                    stroke="#9747FF"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                </svg>
              )}
              
              {/* Target point for swipe */}
              {point.type === 'swipe' && point.targetPosition && (
                <div 
                  className="absolute w-4 h-4 border-2 border-app-purple rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: point.targetPosition.x,
                    top: point.targetPosition.y
                  }}
                />
              )}
            </React.Fragment>
          ))}
          
          {points.length === 0 && !recording && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Click "Start Recording" and add interaction points
            </div>
          )}
          
          {recording && points.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-app-purple">
              Click anywhere to add interaction points
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {currentActionType === 'swipe' 
            ? 'Click once for start point, then again for end point' 
            : 'Click to place interaction points'}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={points.length === 0 || !name}
          className="bg-app-purple hover:bg-app-purple/90"
        >
          Save Sequence
        </Button>
      </div>
    </div>
  );
};

export default SequenceRecorder;
