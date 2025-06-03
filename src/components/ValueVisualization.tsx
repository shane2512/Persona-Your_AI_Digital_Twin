import React from 'react';
import ValueBubble from './ValueBubble';
import { motion } from 'framer-motion';

interface ValueVisualizationProps {
  values: string[];
}

const ValueVisualization: React.FC<ValueVisualizationProps> = ({ values }) => {
  return (
    <div className="relative h-72 w-full flex items-center justify-center my-8">
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-calm-100/50 to-transparent dark:from-calm-500/10 rounded-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      
      {values.map((value, index) => (
        <ValueBubble 
          key={value} 
          value={value} 
          index={index} 
          totalItems={values.length} 
        />
      ))}
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-calm-400 to-calm-500 dark:from-calm-500 dark:to-calm-600 flex items-center justify-center text-white z-10 shadow-lg shadow-calm-400/20 dark:shadow-calm-500/30"
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        <span className="relative text-sm font-medium">YOU</span>
      </motion.div>
    </div>
  );
};

export default ValueVisualization;