
import { useState } from 'react';
import { SequenceData } from './SequenceRecorder';
import { useToast } from "@/components/ui/use-toast";

export const useFloatingSequence = () => {
  const [activeSequence, setActiveSequence] = useState<SequenceData | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();

  const startSequence = (sequence: SequenceData) => {
    setActiveSequence(sequence);
    setIsMinimized(true);
    
    toast({
      title: "Sequence Activated",
      description: `${sequence.name} is now running in the background`,
    });
  };

  const stopSequence = () => {
    setActiveSequence(null);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  return {
    activeSequence,
    isMinimized,
    startSequence,
    stopSequence,
    toggleMinimize
  };
};
