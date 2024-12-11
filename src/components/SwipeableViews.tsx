'use client';

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  ReactNode, 
  Children 
} from 'react';
import { 
  motion, 
  PanInfo, 
  useAnimation, 
  AnimationControls 
} from 'framer-motion';

interface SwipeableViewsProps {
  children: ReactNode;
  pageNames?: string[];
  initialPage?: number;
  threshold?: number;
  animationConfig?: {
    type?: string;
    stiffness?: number;
    damping?: number;
  };
}

export default function SwipeableViews({
  children, 
  pageNames = ['Journal', 'Chat', 'Resources'],
  initialPage = 1,
  threshold = 0.15,
  animationConfig = { 
    type: "spring", 
    stiffness: 400, 
    damping: 40 
  }
}: SwipeableViewsProps) {
  // Ensure initial page is within bounds
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialPage, Children.count(children) - 1))
  );
  
  const [windowWidth, setWindowWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const controls = useAnimation();
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  // Responsive width tracking
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Centralized page change logic
  const changePage = useCallback((newIndex: number) => {
    const boundedIndex = Math.max(
      0, 
      Math.min(newIndex, childrenArray.length - 1)
    );
    
    setCurrentIndex(boundedIndex);
    controls.start({ 
      x: -boundedIndex * 100 + '%',
      transition: animationConfig
    });
  }, [childrenArray, controls, animationConfig]);

  // Drag start handler
  const handleDragStart = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(true);
    }, 
    []
  );

  // Drag end handler with improved gesture recognition
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false);
      
      const { offset, velocity } = info;
      const swipeThreshold = windowWidth * threshold;
      const swipeVelocityThreshold = 500; // px/s

      // Determine direction and magnitude of swipe
      const isSwipeRight = offset.x > swipeThreshold || 
        (velocity.x > swipeVelocityThreshold && offset.x > 0);
      const isSwipeLeft = offset.x < -swipeThreshold || 
        (velocity.x < -swipeVelocityThreshold && offset.x < 0);

      if (isSwipeRight && currentIndex > 0) {
        changePage(currentIndex - 1);
      } else if (isSwipeLeft && currentIndex < childrenArray.length - 1) {
        changePage(currentIndex + 1);
      } else {
        // Snap back to current page
        changePage(currentIndex);
      }
    }, 
    [currentIndex, windowWidth, threshold, changePage, childrenArray.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          changePage(currentIndex - 1);
          break;
        case 'ArrowRight':
          changePage(currentIndex + 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, changePage]);

  return (
    <div 
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
      aria-live="polite"
    >
      {/* Content */}
      <div className="relative h-full pb-24">
        <motion.div
          className="flex h-full touch-pan-y"
          style={{ x: -currentIndex * 100 + '%' }}
          drag="x"
          dragConstraints={{ 
            left: -((childrenArray.length || 0) - 1) * windowWidth, 
            right: 0 
          }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={controls}
          transition={animationConfig}
          aria-current="page"
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="w-screen h-full flex-shrink-0 overflow-hidden"
              role="tabpanel"
              aria-hidden={index !== currentIndex}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Page Indicators */}
      <div 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-50 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full shadow-lg"
        role="tablist"
      >
        {pageNames.slice(0, childrenArray.length).map((name, index) => (
          <button
            key={index}
            onClick={() => changePage(index)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-blue-600 text-white'
                : 'hover:bg-white/10 dark:hover:bg-white/5'
            }`}
            role="tab"
            aria-selected={currentIndex === index}
            aria-controls={`page-${index}`}
          >
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-white'
                : 'bg-neutral-400/50'
            }`} />
            <span className={`text-sm transition-all duration-300 ${
              currentIndex === index
                ? 'opacity-100'
                : 'opacity-70'
            }`}>
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
