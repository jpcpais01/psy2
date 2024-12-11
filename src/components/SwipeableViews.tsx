'use client';

import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useState, useEffect, Children, useRef, useMemo } from 'react';

const PAGE_NAMES = ['Journal', 'Chat', 'Resources'];

export default function SwipeableViews({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Memoize children array to prevent unnecessary re-renders
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  // Calculate window width safely
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 375;

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent, 
    { offset, velocity }: PanInfo
  ) => {
    const swipe = offset.x;
    const swipeVelocity = velocity.x;

    // Determine swipe direction and magnitude
    const isSwipingLeft = swipe < 0;
    const isSwipingRight = swipe > 0;
    const swipeThreshold = windowWidth * 0.2;
    const velocityThreshold = 300; // pixels per second

    // Decide whether to change page based on swipe distance and velocity
    const shouldChangePage = 
      Math.abs(swipe) > swipeThreshold || 
      Math.abs(swipeVelocity) > velocityThreshold;

    if (shouldChangePage) {
      if (isSwipingLeft && currentIndex < childrenArray.length - 1) {
        // Swipe left to next page
        setCurrentIndex(prev => prev + 1);
      } else if (isSwipingRight && currentIndex > 0) {
        // Swipe right to previous page
        setCurrentIndex(prev => prev - 1);
      }
    }

    // Animate back to the current page
    controls.start({ 
      x: -currentIndex * 100 + '%',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    });
  };

  // Update page position whenever currentIndex changes
  useEffect(() => {
    controls.start({ 
      x: -currentIndex * 100 + '%',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    });
  }, [currentIndex, controls]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none'
      }}
    >
      {/* Content */}
      <div className="relative h-full pb-24">
        <motion.div
          className="flex h-full"
          style={{ 
            x: -currentIndex * 100 + '%',
            touchAction: 'none'
          }}
          drag="x"
          dragConstraints={{ 
            left: -(childrenArray.length - 1) * windowWidth, 
            right: 0 
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={controls}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            mass: 0.8
          }}
        >
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className="w-screen h-full flex-shrink-0 overflow-hidden"
              style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none'
              }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Page Indicators */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-50 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
        {PAGE_NAMES.map((name, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-blue-600 text-white'
                : 'hover:bg-white/10 dark:hover:bg-white/5'
            }`}
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
