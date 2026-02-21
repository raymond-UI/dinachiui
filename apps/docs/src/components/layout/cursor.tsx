'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, type MotionStyle } from 'motion/react';
import { cn } from '@/lib/utils';

export interface CursorProps {
  /**
   * Whether to show the cursor component
   */
  enabled?: boolean;
  /**
   * Cursor type/style
   */
  type?: 'default' | 'pointer' | 'text' | 'grab' | 'custom';
  /**
   * Whether to create a follow cursor effect
   */
  follow?: boolean;
  /**
   * Custom content to display in cursor
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom styling for the cursor
   */
  style?: React.CSSProperties;
  /**
   * Animation spring configuration
   */
  spring?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
  };
  /**
   * Scale factor when hovering interactive elements
   */
  hoverScale?: number;
  /**
   * Scale factor when clicking
   */
  clickScale?: number;
  /**
   * Whether to enable magnetic snapping to targets
   */
  magnetic?: boolean;
  /**
   * Selector for magnetic targets
   */
  magneticSelector?: string;
}

export const Cursor: React.FC<CursorProps> = ({
  enabled = true,
  type = 'default',
  follow = false,
  children,
  className,
  style,
  spring = { stiffness: 500, damping: 28, mass: 0.5 },
  hoverScale = 1.5,
  clickScale = 0.8,
  magnetic = false,
  magneticSelector = '[data-magnetic]',
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState(type);
  const [customContent, setCustomContent] = useState<React.ReactNode>(null);

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Spring animations for smooth movement
  const springX = useSpring(cursorX, spring);
  const springY = useSpring(cursorY, spring);

  useEffect(() => {
    if (!enabled) return;

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      
      if (magnetic) {
        const magneticElement = (e.target as Element)?.closest(magneticSelector);
        if (magneticElement) {
          const rect = magneticElement.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          cursorX.set(centerX);
          cursorY.set(centerY);
          return;
        }
      }
      
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Ensure target is an HTMLElement and has getAttribute method
      if (!target || typeof target.getAttribute !== 'function') {
        return;
      }
      
      // Check for custom cursor content
      const customCursor = target.getAttribute('data-cursor');
      if (customCursor) {
        setCustomContent(customCursor);
      }
      
      // Detect interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.getAttribute('role') === 'button' ||
        (target as HTMLElement).style?.cursor === 'pointer' ||
        target.closest('a, button, [role="button"]')
      ) {
        setIsHovering(true);
        setCursorType('pointer');
      }
      
      // Detect text elements
      else if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3' ||
        target.tagName === 'H4' ||
        target.tagName === 'H5' ||
        target.tagName === 'H6' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'BLOCKQUOTE' ||
        target.tagName === 'LI' ||
        // target.tagName === 'DIV' ||
        (target instanceof HTMLElement && window.getComputedStyle(target).cursor === 'text')
      ) {
        setIsHovering(true);
        setCursorType('text');
      }
      
      // If no specific type is detected, reset to default
      else {
        setIsHovering(false);
        setCursorType(type);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorType(type);
      setCustomContent(null);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseOut = () => {
      setIsVisible(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      // Restore default cursor
      document.body.style.cursor = 'auto';
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [enabled, type, magnetic, magneticSelector, cursorX, cursorY, spring]);

  if (!enabled) return null;

  const getCursorVariants = () => {
    const baseScale = isClicking ? clickScale : isHovering ? hoverScale : 1;
    
    return {
      default: {
        scale: baseScale,
        transition: { duration: 0.15 }
      },
      pointer: {
        scale: baseScale * 1.2,
        transition: { duration: 0.15 }
      },
      text: {
        scaleX: baseScale * 0.5,
        scaleY: baseScale * 2,
        transition: { duration: 0.15 }
      },
      grab: {
        scale: baseScale * 1.1,
        transition: { duration: 0.15 }
      },
      custom: {
        scale: baseScale,
        transition: { duration: 0.15 }
      }
    };
  };

  const variants = getCursorVariants();

  // Helper function to get scale value for follow effect
  const getScaleForVariant = (variant: typeof variants[keyof typeof variants]) => {
    if ('scale' in variant) {
      return variant.scale;
    }
    // For text cursor that uses scaleX/scaleY, use scaleX as the base scale
    if ('scaleX' in variant) {
      return variant.scaleX;
    }
    return 1;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={cursorRef}
          className={cn(
            'pointer-events-none fixed z-9999 flex items-center justify-center',
            follow ? '' : '',
            className
          )}
          style={{
            left: 0,
            top: 0,
            x: springX,
            y: springY,
            ...style,
          } as MotionStyle}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, ...variants[cursorType] }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {/* Main cursor */}
          <motion.div
            className={cn(
              'rounded-full border-2',
              cursorType === 'default' && 'h-6 w-6 bg-black/20 border-black',
              cursorType === 'pointer' && 'h-4 w-4 bg-blue-500/30 border-blue-500',
              cursorType === 'text' && 'h-6 w-0.5 bg-gray-800 border-gray-800 rounded-none',
              cursorType === 'grab' && 'h-6 w-6 bg-green-500/30 border-green-500',
              cursorType === 'custom' && 'h-6 w-6 bg-purple-500/30 border-purple-500'
            )}
            animate={variants[cursorType]}
          />
          
          {/* Custom content */}
          {(children || customContent) && (
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-sm text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {children || customContent}
            </motion.div>
          )}
          
          {/* Follow cursor trail effect */}
          {follow && (
            <>
              <motion.div
                className="absolute h-3 w-3 rounded-full bg-black/10 border border-black/20"
                animate={{ 
                  scale: getScaleForVariant(variants[cursorType]) * 0.7,
                  transition: { duration: 0.15 }
                }}
                transition={{ delay: 0.05 }}
              />
              <motion.div
                className="absolute h-2 w-2 rounded-full bg-black/5 border border-black/10"
                animate={{ 
                  scale: getScaleForVariant(variants[cursorType]) * 0.4,
                  transition: { duration: 0.15 }
                }}
                transition={{ delay: 0.1 }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Hook to programmatically control cursor state
 */
export const useCursorState = () => {
  const [cursorType, setCursorType] = useState<CursorProps['type']>('default');
  const [isHovering, setIsHovering] = useState(false);
  const [customContent, setCustomContent] = useState<React.ReactNode>(null);

  const setCursor = (type: CursorProps['type'], content?: React.ReactNode) => {
    setCursorType(type);
    if (content) setCustomContent(content);
  };

  const resetCursor = () => {
    setCursorType('default');
    setCustomContent(null);
    setIsHovering(false);
  };

  return {
    cursorType,
    isHovering,
    customContent,
    setCursor,
    resetCursor,
    setIsHovering,
    setCustomContent,
  };
};

export default Cursor; 