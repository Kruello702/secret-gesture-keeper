
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Fingerprint, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

export interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export interface GestureData {
  id: string;
  name: string;
  points: Point[];
  createdAt: string;
}

interface GestureRecorderProps {
  onGestureRecorded: (gesture: GestureData) => void;
  onCancel: () => void;
  gestureName: string;
}

const GestureRecorder: React.FC<GestureRecorderProps> = ({ onGestureRecorded, onCancel, gestureName }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [gesture, setGesture] = useState<Point[]>([]);
  const [gesturePreview, setGesturePreview] = useState<Point[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const recorderRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      setIsRecording(false);
      setGesture([]);
    };
  }, []);

  const startRecording = () => {
    setGesture([]);
    setIsRecording(true);
    setIsReviewing(false);

    toast({
      title: "Recording started",
      description: "Draw your gesture pattern now",
    });
  };

  const stopRecording = () => {
    if (gesture.length < 10) {
      toast({
        variant: "destructive",
        title: "Gesture too short",
        description: "Please draw a longer gesture pattern",
      });
      return;
    }

    setIsRecording(false);
    setIsReviewing(true);
    setGesturePreview([...gesture]);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isRecording) return;
    
    const rect = recorderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setGesture([{ x, y, timestamp: Date.now() }]);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isRecording) return;
    
    const rect = recorderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setGesture(prev => [...prev, { x, y, timestamp: Date.now() }]);
  };

  const handleTouchEnd = () => {
    if (!isRecording) return;
    
    if (gesture.length > 0) {
      stopRecording();
    }
  };

  const saveGesture = () => {
    const newGesture: GestureData = {
      id: Date.now().toString(),
      name: gestureName,
      points: gesture,
      createdAt: new Date().toISOString(),
    };
    
    onGestureRecorded(newGesture);
    toast({
      title: "Gesture saved",
      description: `${gestureName} gesture has been saved successfully`,
    });
  };

  const retryRecording = () => {
    setGesture([]);
    setIsReviewing(false);
    setIsRecording(false);
  };

  const renderGesture = (points: Point[]) => {
    if (points.length < 2) return null;
    
    return (
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {points.map((point, i) => (
          <React.Fragment key={i}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="4" 
              className="fill-app-purple"
            />
            {i > 0 && (
              <line 
                x1={points[i-1].x} 
                y1={points[i-1].y} 
                x2={point.x} 
                y2={point.y} 
                className="stroke-app-purple stroke-2"
              />
            )}
          </React.Fragment>
        ))}
      </svg>
    );
  };

  return (
    <Card className="w-full max-w-md bg-card border-muted">
      <CardHeader>
        <CardTitle className="text-center">
          {isReviewing ? "Review Your Gesture" : "Record Gesture"}
        </CardTitle>
        <CardDescription className="text-center">
          {isReviewing 
            ? "Is this the gesture you want to save?"
            : isRecording 
              ? "Draw your gesture pattern" 
              : "Click 'Start Recording' and draw your gesture"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          ref={recorderRef}
          className={cn(
            "relative h-64 bg-muted/30 rounded-lg mb-4 overflow-hidden",
            isRecording && "border-2 border-app-purple",
            isReviewing && "border-2 border-app-blue"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          {isRecording && (
            <div className="absolute top-2 right-2 recording-indicator">
              <div className="w-3 h-3 rounded-full bg-app-red"></div>
            </div>
          )}
          
          {isRecording && gesture.length > 0 && renderGesture(gesture)}
          {isReviewing && renderGesture(gesturePreview)}
          
          {!isRecording && !isReviewing && (
            <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground">
              <Fingerprint className="h-12 w-12 mb-2 text-app-purple/70" />
              <p>Draw your gesture here</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        {!isRecording && !isReviewing ? (
          <>
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={startRecording}
              className="flex-1 bg-app-purple hover:bg-app-purple/90"
            >
              <Fingerprint className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          </>
        ) : isReviewing ? (
          <>
            <Button
              variant="outline"
              onClick={retryRecording}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button
              onClick={saveGesture}
              className="flex-1 bg-app-purple hover:bg-app-purple/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Gesture
            </Button>
          </>
        ) : (
          <Button
            variant="destructive"
            onClick={() => setIsRecording(false)}
            className="flex-1"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Recording
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GestureRecorder;
