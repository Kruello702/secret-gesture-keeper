
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Calendar, Clock, PlayCircle } from "lucide-react";
import { SequenceData } from './SequenceRecorder';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from 'date-fns';

interface SequenceListProps {
  sequences: SequenceData[];
  onDeleteSequence: (id: string) => void;
  onEditSequence: (id: string) => void;
  onActivateSequence?: (id: string) => void;
}

const SequenceList: React.FC<SequenceListProps> = ({ 
  sequences, 
  onDeleteSequence, 
  onEditSequence,
  onActivateSequence
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const handleActivate = (id: string) => {
    if (onActivateSequence) {
      onActivateSequence(id);
    }
  };

  if (sequences.length === 0) {
    return (
      <Card className="bg-card border-none">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No sequences created yet. Create a sequence to automate interactions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sequences.map((sequence) => (
        <Card key={sequence.id} className="bg-card overflow-hidden border-muted relative group">
          <CardContent className="p-4">
            <div className="mb-2 flex justify-between items-start">
              <h3 className="font-medium truncate pr-10">{sequence.name}</h3>
              <div className="flex gap-1 absolute top-4 right-4">
                {onActivateSequence && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-70 hover:opacity-100"
                          onClick={() => handleActivate(sequence.id)}
                        >
                          <PlayCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Activate sequence</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-70 hover:opacity-100"
                        onClick={() => onEditSequence(sequence.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit sequence</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-70 hover:opacity-100"
                        onClick={() => onDeleteSequence(sequence.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete sequence</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="truncate">{formatDate(sequence.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {sequence.timerEnabled 
                    ? `Auto runs every ${sequence.timerDelay} min` 
                    : 'Manual activation'}
                </span>
              </div>
            </div>
            
            <div className="bg-muted p-2 rounded text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{sequence.points.length} actions</span>
              </div>
              <div className="space-y-1">
                {sequence.points.slice(0, 3).map((point, index) => (
                  <div key={point.id} className="flex items-center text-muted-foreground">
                    <span className="inline-block w-4 h-4 rounded-full bg-app-purple/30 text-center mr-2 text-[10px]">
                      {index + 1}
                    </span>
                    <span className="capitalize">
                      {point.type} 
                      {point.targetPosition && ' → Swipe'}
                    </span>
                  </div>
                ))}
                {sequence.points.length > 3 && (
                  <div className="text-muted-foreground text-center">
                    +{sequence.points.length - 3} more actions
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SequenceList;
