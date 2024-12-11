'use client';

import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useState, useEffect, Children, useRef } from 'react';

const PAGE_NAMES = ['Journal', 'Chat', 'Resources'];

export default function SwipeableViews({ children }: { children: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [dragStart, setDragStart] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 375);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure this only runs on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragStart(info.point.x);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Fallback to a default width if window is not available
    const currentWidth = typeof window !== 'undefined' ? window.innerWidth : 375;
    const diff = dragStart - info.point.x;
    const threshold = currentWidth * 0.15;

    // Use React.Children.toArray for type-safe array conversion
    const childrenArray = Children.toArray(children);
    
    if (childrenArray.length > 0) {
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < childrenArray.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }
    }
    controls.start({ x: -currentIndex * 100 + '%' });
  };

  useEffect(() => {
    controls.start({ x: -currentIndex * 100 + '%' });
  }, [currentIndex, controls]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
    >
      {/* Content */}
      <div className="relative h-full pb-24">
        <motion.div
          className="flex h-full"
          style={{ 
            x: -currentIndex * 100 + '%',
            touchAction: 'pan-y pinch-zoom'
          }}
          drag="x"
          dragConstraints={{ 
            left: -(Children.count(children) - 1) * windowWidth, 
            right: 0 
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
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
