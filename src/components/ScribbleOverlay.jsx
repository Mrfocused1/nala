import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Generates a chaotic "scribble" path that zig-zags from bottom to top.
 */
const generateScribblePath = () => {
  // Start well below the viewport to ensure no gaps at bottom
  let path = "M 50 120";
  let y = 120;
  // Denser steps for better coverage
  const stepY = 9;

  // Create a zig-zag loop up the screen
  while (y > -30) {
    // Zig (Right)
    y -= stepY;
    path += ` C ${30 + Math.random() * 30} ${y + 5}, ${80 - Math.random() * 20} ${y + 5}, 130 ${y}`;

    // Loop/Turn Right side
    y -= stepY / 3;
    path += ` C 140 ${y}, 120 ${y - 5}, 90 ${y}`;

    // Zag (Left)
    y -= stepY;
    path += ` C ${60 + Math.random() * 20} ${y + 5}, ${20 - Math.random() * 20} ${y - 5}, -30 ${y}`;

    // Loop/Turn Left side
    y -= stepY / 3;
    path += ` C -40 ${y}, -10 ${y - 5}, 10 ${y}`;
  }
  return path;
};

/**
 * ScribbleOverlay:
 * Draws in to cover the page, then un-draws to reveal new content
 */
const ScribbleOverlay = ({ color = "#c1765b", onComplete }) => {
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'
  const scribblePath = useMemo(() => generateScribblePath(), []);

  useEffect(() => {
    // After draw-in completes, wait a moment then start un-drawing
    const timer = setTimeout(() => {
      setPhase('exit');
    }, 850); // 800ms draw + 50ms hold

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ opacity: 1 }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {/* The Marker Stroke */}
        <motion.path
          d={scribblePath}
          fill="none"
          stroke={color}
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: phase === 'enter' ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "linear" }}
          onAnimationComplete={() => {
            // When un-draw completes, notify parent to remove component
            if (phase === 'exit') {
              onComplete?.();
            }
          }}
        />
      </svg>
    </motion.div>
  );
};

export default ScribbleOverlay;
