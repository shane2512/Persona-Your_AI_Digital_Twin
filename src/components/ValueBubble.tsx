import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface ValueBubbleProps {
  value: string;
  index: number;
  totalItems: number;
}

const bubbleColors = [
  'bg-gradient-to-br from-calm-400 to-calm-500 text-white shadow-lg shadow-calm-400/20',
  'bg-gradient-to-br from-calm-500 to-calm-600 text-white shadow-lg shadow-calm-500/20',
  'bg-gradient-to-br from-calm-300 to-calm-400 text-surface-900 shadow-lg shadow-calm-300/20',
  'bg-gradient-to-br from-calm-200 to-calm-300 text-surface-900 shadow-lg shadow-calm-200/20',
];

const ValueBubble: React.FC<ValueBubbleProps> = ({ value, index, totalItems }) => {
  const angle = (index / totalItems) * 2 * Math.PI;
  const radius = 120;
  
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  const colorClass = bubbleColors[index % bubbleColors.length];
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
        "absolute flex items-center justify-center rounded-2xl backdrop-blur-sm",
        "border-2 border-white/20 dark:border-white/10",
        colorClass,
        "hover:scale-110 transition-transform duration-300"
      )}
      style={{ 
        width: size,
        height: size,
        zIndex: totalItems - index,
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
      <span className="relative text-sm font-medium leading-tight">{value}</span>
    </motion.div>
  );
};

export default ValueBubble;