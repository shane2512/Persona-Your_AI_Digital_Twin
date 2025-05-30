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
        className="absolute inset-0 bg-gradient-radial from-primary-50/50 to-transparent dark:from-primary-900/10 rounded-xl"
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
        className="w-16 h-16 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center text-white z-10"
      >
        <span className="text-sm font-medium">YOU</span>
      </motion.div>
    </div>
  );
};

export default ValueVisualization;