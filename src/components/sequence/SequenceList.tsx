
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Trash2, Edit } from "lucide-react";
import { SequenceData } from './SequenceRecorder';
import { formatDistanceToNow } from 'date-fns';

interface SequenceListProps {
  sequences: SequenceData[];
  onDeleteSequence: (id: string) => void;
  onEditSequence: (id: string) => void;
}

const SequenceList: React.FC<SequenceListProps> = ({ 
  sequences, 
  onDeleteSequence, 
  onEditSequence 
}) => {
  return (
    <Card className="w-full bg-card border-muted">
      <CardHeader>
        <CardTitle>Your Sequences</CardTitle>
        <CardDescription>
          {sequences.length > 0 
            ? "Manage your saved automation sequences" 
            : "You haven't created any sequences yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sequences.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Layers className="mx-auto h-10 w-10 mb-2 text-muted-foreground/60" />
            <p>Create your first sequence to get started</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sequences.map((sequence) => (
              <li 
                key={sequence.id} 
                className="p-3 rounded-md bg-muted/30 border border-muted flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-app-purple/20 flex items-center justify-center mr-3">
                    <Layers className="h-4 w-4 text-app-purple" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{sequence.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {sequence.points.length} steps {sequence.createdAt && 
                      `• Created ${formatDistanceToNow(new Date(sequence.createdAt))} ago`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditSequence(sequence.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteSequence(sequence.id)}
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

export default SequenceList;
