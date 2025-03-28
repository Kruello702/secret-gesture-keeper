
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fingerprint, Trash2, Edit } from "lucide-react";
import { GestureData } from './GestureRecorder';
import { formatDistanceToNow } from 'date-fns';

interface GestureListProps {
  gestures: GestureData[];
  onDeleteGesture: (id: string) => void;
  onEditGesture: (id: string) => void;
}

const GestureList: React.FC<GestureListProps> = ({ 
  gestures, 
  onDeleteGesture, 
  onEditGesture 
}) => {
  return (
    <Card className="w-full bg-card border-muted">
      <CardHeader>
        <CardTitle>Your Gestures</CardTitle>
        <CardDescription>
          {gestures.length > 0 
            ? "Manage your saved security gestures" 
            : "You haven't created any gestures yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gestures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Fingerprint className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
            <p>Record your first gesture to get started</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {gestures.map((gesture) => (
              <li 
                key={gesture.id} 
                className="p-3 rounded-md bg-muted/30 border border-muted flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-app-purple/20 flex items-center justify-center mr-3">
                    <Fingerprint className="h-4 w-4 text-app-purple" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{gesture.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Created {formatDistanceToNow(new Date(gesture.createdAt))} ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditGesture(gesture.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteGesture(gesture.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default GestureList;
