
import React, { useState, useRef, useEffect } from 'react';
import { 
  Hand, 
  MousePointer, 
  MousePointerClick,
  X,
  Check,
  Circle,
  Plus
} from 'lucide-react';
import { SequencePoint, SequenceData } from './SequenceRecorder';

interface MinimizedSequenceRecorderProps {
  onSequenceRecorded: (sequence: SequenceData) => void;
  onCancel: () => void;
  sequenceName?: string;
}

const MinimizedSequenceRecorder: React.FC<MinimizedSequenceRecorderProps> = ({
  onSequenceRecorded,
  onCancel,
  sequenceName = 'New Sequence'
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);
  const [currentActionType, setCurrentActionType] = useState<'tap' | 'double-tap' | 'swipe'>('tap');
  const [points, setPoints] = useState<SequencePoint[]>([]);
  const [currentSwipeStart, setCurrentSwipeStart] = useState<{ x: number; y: number } | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDelay, setTimerDelay] = useState(5); // Default 5 minutes
  const [name, setName] = useState(sequenceName);
  const [inputVisible, setInputVisible] = useState(false);
  
  const bubbleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag operations
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.stopPropagation();
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
  
  // Focus the input when it becomes visible
  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);
  
  const handleDocumentClick = (e: MouseEvent) => {
    if (!showToolbar) return;
    
    // Don't handle clicks on the main bubble or its children
    if (bubbleRef.current?.contains(e.target as Node)) return;
    
    // For tap and double-tap
    if (currentActionType !== 'swipe' || currentSwipeStart === null) {
      addPoint(e.clientX, e.clientY);
    } 
    // For swipe (second click to complete the swipe)
    else if (currentSwipeStart !== null) {
      completeSwipe(e.clientX, e.clientY);
    }
  };
  
  useEffect(() => {
    if (showToolbar) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showToolbar, currentActionType, currentSwipeStart]);
  
  const addPoint = (x: number, y: number) => {
    const newPoint: SequencePoint = {
      id: `point-${Date.now()}`,
      type: currentActionType,
      position: { x, y }
    };
    setPoints(prev => [...prev, newPoint]);
  };
  
  const completeSwipe = (x: number, y: number) => {
    if (!currentSwipeStart) return;
    
    const newPoint: SequencePoint = {
      id: `point-${Date.now()}`,
      type: 'swipe',
      position: currentSwipeStart,
      targetPosition: { x, y }
    };
    setPoints(prev => [...prev, newPoint]);
    setCurrentSwipeStart(null);
  };
  
  const startSwipe = (x: number, y: number) => {
    setCurrentSwipeStart({ x, y });
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
  
  const toggleToolbar = () => {
    setShowToolbar(prev => !prev);
  };
  
  const selectActionType = (type: 'tap' | 'double-tap' | 'swipe') => {
    setCurrentActionType(type);
    setCurrentSwipeStart(null);
  };
  
  const handleRemovePoint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPoints(prev => prev.filter(point => point.id !== id));
  };
  
  const handleMainBubbleClick = (e: React.MouseEvent) => {
    if (!isDragging && !showToolbar) {
      toggleToolbar();
      e.stopPropagation();
    }
  };
  
  const showSequenceNameInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputVisible(true);
  };
  
  const closeNameInput = () => {
    setInputVisible(false);
  };
  
  const submitSequenceName = (e: React.FormEvent) => {
    e.preventDefault();
    closeNameInput();
  };
  
  return (
    <>
      {/* Main Bubble */}
      <div
        ref={bubbleRef}
        className="fixed z-50 shadow-lg rounded-full cursor-move select-none transition-all duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: showToolbar ? '200px' : '60px',
          height: showToolbar ? '200px' : '60px',
          backgroundColor: '#9747FF',
          opacity: 0.9
        }}
        onMouseDown={handleDragStart}
        onClick={handleMainBubbleClick}
      >
        {showToolbar ? (
          // Expanded view with tools
          <div className="w-full h-full p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              {inputVisible ? (
                <form onSubmit={submitSequenceName} className="flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded bg-white/20 text-white placeholder-white/60 outline-none"
                    placeholder="Sequence name"
                    onBlur={closeNameInput}
                  />
                </form>
              ) : (
                <div 
                  className="text-white text-sm font-medium truncate cursor-pointer flex-1" 
                  onClick={showSequenceNameInput}
                  title="Click to edit name"
                >
                  {name || 'New Sequence'}
                </div>
              )}
              <button 
                className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 ml-1"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex justify-around mb-3">
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentActionType === 'tap' ? 'bg-white text-app-purple' : 'bg-white/20 text-white'}`}
                onClick={() => selectActionType('tap')}
                title="Tap"
              >
                <MousePointer className="h-5 w-5" />
              </button>
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentActionType === 'double-tap' ? 'bg-white text-app-purple' : 'bg-white/20 text-white'}`}
                onClick={() => selectActionType('double-tap')}
                title="Double Tap"
              >
                <MousePointerClick className="h-5 w-5" />
              </button>
              <button
                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentActionType === 'swipe' ? 'bg-white text-app-purple' : 'bg-white/20 text-white'}`}
                onClick={() => selectActionType('swipe')}
                title="Swipe"
              >
                <Hand className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto px-2">
              {points.length > 0 ? (
                <div className="space-y-1">
                  {points.map((point, index) => (
                    <div 
                      key={point.id} 
                      className="flex items-center bg-white/10 rounded px-2 py-1 text-white text-xs"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center mr-2 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 truncate">
                        {point.type === 'tap' ? 'Tap' : 
                          point.type === 'double-tap' ? 'Double Tap' : 'Swipe'}
                      </div>
                      <button 
                        className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
                        onClick={(e) => handleRemovePoint(point.id, e)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/70 text-xs text-center my-2">
                  Click anywhere to add a point
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <button
                className="w-full py-1.5 bg-white rounded-full text-app-purple font-medium text-sm disabled:opacity-50"
                onClick={handleSave}
                disabled={points.length === 0 || !name}
              >
                Save Sequence
              </button>
            </div>
          </div>
        ) : (
          // Collapsed view
          <div className="w-full h-full flex items-center justify-center">
            <Plus className="text-white h-6 w-6" />
          </div>
        )}
      </div>
      
      {/* Sequence point markers */}
      {points.map((point, index) => (
        <React.Fragment key={point.id}>
          <div 
            className="fixed z-40 flex items-center justify-center rounded-full shadow-md animate-pulse"
            style={{
              left: `${point.position.x}px`,
              top: `${point.position.y}px`,
              width: '36px',
              height: '36px',
              backgroundColor: '#9747FF',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-white font-bold text-sm">
              {index + 1}
            </div>
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
                  stroke="#9747FF"
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
                  backgroundColor: '#9747FF40',
                  border: '2px solid #9747FF',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </>
          )}
        </React.Fragment>
      ))}
      
      {/* Swipe start indicator */}
      {currentSwipeStart && (
        <div 
          className="fixed z-40 rounded-full animate-pulse"
          style={{
            left: `${currentSwipeStart.x}px`,
            top: `${currentSwipeStart.y}px`,
            width: '24px',
            height: '24px',
            backgroundColor: '#9747FF40',
            border: '2px solid #9747FF',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
    </>
  );
};

export default MinimizedSequenceRecorder;
