
import React, { useState, useEffect, useRef } from 'react';
import { 
  Hand, 
  MousePointer, 
  MousePointerClick,
  X,
  Play,
  Pause
} from 'lucide-react';
import { SequenceData, SequencePoint } from './SequenceRecorder';

interface FloatingBubbleProps {
  sequence: SequenceData;
  onClose: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ sequence, onClose }) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(-1);
  const [showPointBubbles, setShowPointBubbles] = useState(false);
  
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  
  // Handle timer-based activation
  useEffect(() => {
    if (sequence.timerEnabled && sequence.timerDelay) {
      const timer = setTimeout(() => {
        startSequence();
      }, sequence.timerDelay * 60 * 1000); // Convert minutes to milliseconds
      
      return () => clearTimeout(timer);
    }
  }, [sequence]);
  
  // Play sequence
  const startSequence = () => {
    setIsPlaying(true);
    setCurrentPointIndex(0);
    setShowPointBubbles(true);
    
    // Reset any existing timers
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
  };
  
  // Handle sequence playback
  useEffect(() => {
    if (!isPlaying || currentPointIndex === -1) return;
    
    if (currentPointIndex >= sequence.points.length) {
      // Sequence complete
      setIsPlaying(false);
      setCurrentPointIndex(-1);
      setShowPointBubbles(false);
      return;
    }
    
    // Move to next point after a delay
    const nextPointDelay = sequence.points[currentPointIndex].delay || 1000;
    timerRef.current = window.setTimeout(() => {
      setCurrentPointIndex(prev => prev + 1);
    }, nextPointDelay);
    
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentPointIndex, sequence.points]);
  
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain to viewport
    const constrainedX = Math.max(0, Math.min(window.innerWidth - 60, newX));
    const constrainedY = Math.max(0, Math.min(window.innerHeight - 60, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };
  
  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);
  
  const getActionIcon = (type: 'tap' | 'double-tap' | 'swipe') => {
    switch (type) {
      case 'tap':
        return <MousePointer className="h-4 w-4" />;
      case 'double-tap':
        return <MousePointerClick className="h-4 w-4" />;
      case 'swipe':
        return <Hand className="h-4 w-4" />;
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    } else {
      startSequence();
    }
  };
  
  return (
    <>
      {/* Main bubble */}
      <div
        ref={bubbleRef}
        className="fixed z-50 flex items-center justify-center shadow-lg rounded-full cursor-move select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isExpanded ? '180px' : '60px',
          height: isExpanded ? '180px' : '60px',
          backgroundColor: '#9747FF',
          transition: 'width 0.2s, height 0.2s',
          opacity: 0.9
        }}
        onMouseDown={handleDragStart}
      >
        {!isExpanded ? (
          // Collapsed view
          <div 
            className="flex flex-col items-center justify-center text-white"
            onClick={() => setIsExpanded(true)}
          >
            <div className="text-xs font-semibold mb-1">Sequence</div>
            <div className="text-xs">{sequence.points.length} steps</div>
          </div>
        ) : (
          // Expanded view
          <div className="flex flex-col items-center w-full h-full p-2">
            <div className="flex justify-between w-full">
              <button 
                className="w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/30"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4" />
              </button>
              <button 
                className="w-7 h-7 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/30"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-white text-xs font-semibold mt-2 truncate max-w-[90%]">
              {sequence.name}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {sequence.points.slice(0, 4).map((point, index) => (
                <div 
                  key={point.id}
                  className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center"
                  title={`${point.type} action`}
                >
                  {getActionIcon(point.type)}
                </div>
              ))}
              {sequence.points.length > 4 && (
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-white text-xs">
                  +{sequence.points.length - 4}
                </div>
              )}
            </div>
            
            <button
              className="mt-auto mb-2 px-4 py-1 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-medium hover:bg-white/30"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Play
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Sequence Point Bubbles */}
      {showPointBubbles && sequence.points.map((point, index) => (
        <div
          key={point.id}
          className="fixed z-40 flex items-center justify-center rounded-full shadow-md"
          style={{
            left: `${point.position.x}px`,
            top: `${point.position.y}px`,
            width: '36px',
            height: '36px',
            backgroundColor: currentPointIndex === index ? '#9747FF' : '#E5DEFF',
            opacity: currentPointIndex === index ? 1 : 0.7,
            transform: 'translate(-50%, -50%)',
            transition: 'background-color 0.3s, opacity 0.3s'
          }}
        >
          <div className="text-center font-bold text-sm">
            {index + 1}
          </div>
          
          {point.type === 'swipe' && point.targetPosition && (
            <>
              {/* Swipe line */}
              <svg 
                className="fixed top-0 left-0 w-full h-full z-30"
                style={{ pointerEvents: 'none' }}
              >
                <line
                  x1={point.position.x}
                  y1={point.position.y}
                  x2={point.targetPosition.x}
                  y2={point.targetPosition.y}
                  stroke={currentPointIndex === index ? '#9747FF' : '#E5DEFF'}
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              </svg>
              
              {/* Target point for swipe */}
              <div 
                className="fixed z-40 rounded-full"
                style={{
                  left: `${point.targetPosition.x}px`,
                  top: `${point.targetPosition.y}px`,
                  width: '24px',
                  height: '24px',
                  backgroundColor: currentPointIndex === index ? '#9747FF40' : '#E5DEFF40',
                  border: `2px solid ${currentPointIndex === index ? '#9747FF' : '#E5DEFF'}`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default FloatingBubble;
