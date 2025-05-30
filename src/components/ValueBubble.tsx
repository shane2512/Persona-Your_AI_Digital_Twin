import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface ValueBubbleProps {
  value: string;
  index: number;
  totalItems: number;
}

// Define a set of colors to cycle through
const bubbleColors = [
  'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
  'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
  'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
  'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300',
];

const ValueBubble: React.FC<ValueBubbleProps> = ({ value, index, totalItems }) => {
  // Calculate position within a circular arrangement
  const angle = (index / totalItems) * 2 * Math.PI;
  const radius = 120; // Adjust based on your layout
  
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  // Pick a color based on the index
  const colorClass = bubbleColors[index % bubbleColors.length];
  
  // Calculate size based on importance (for this demo, random variation)
  const size = 60 + Math.floor(Math.random() * 30);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x,
        y
      }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1 * index,
      }}
      className={cn(
        "absolute flex items-center justify-center rounded-full p-3 text-center shadow-soft",
        colorClass
      )}
      style={{ 
        width: size,
        height: size,
        zIndex: totalItems - index,
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <span className="text-sm font-medium leading-tight">{value}</span>
    </motion.div>
  );
};

export default ValueBubble;