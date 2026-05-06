import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a touch device
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a'
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Liquid Trailing Dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: 8 - i,
            height: 8 - i,
            borderRadius: '50%',
            backgroundColor: 'var(--accent-color)',
            opacity: 0.5 - i * 0.1,
            pointerEvents: 'none',
            zIndex: 10000 - i,
            x: position.x,
            y: position.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          transition={{
            type: 'spring',
            damping: 20 + i * 5,
            stiffness: 150 - i * 20,
            mass: 0.5 + i * 0.2
          }}
        />
      ))}

      {/* Main Glass Ring */}
      <motion.div
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 0.8 : (isPointer ? 1.5 : 1),
          backgroundColor: isPointer ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.5 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(2px)',
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10001,
          boxShadow: isPointer ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
        }}
      />

      {/* Center Dot */}
      <motion.div
        animate={{ x: position.x, y: position.y, scale: isClicking ? 1.5 : 1 }}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'white',
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10002,
          boxShadow: '0 0 10px white'
        }}
      />
    </>
  );
};

export default CustomCursor;
