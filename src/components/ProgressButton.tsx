import React from 'react';
import { cn } from '../utils/cn';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressButtonProps {
  onNext?: () => void;
  onBack?: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

const ProgressButton: React.FC<ProgressButtonProps> = ({
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
  isLastStep = false,
  isLoading = false,
}) => {
  return (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
      <motion.button
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onBack}
        disabled={isBackDisabled}
        className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300",
          isBackDisabled 
            ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400" 
            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-lg hover:shadow-xl"
        )}
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: isNextDisabled || isLoading ? 1 : 1.02 }}
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className={cn(
          "flex items-center gap-3 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg",
          (isNextDisabled || isLoading) 
            ? "opacity-70 cursor-not-allowed bg-slate-300 dark:bg-slate-700 text-slate-500" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl"
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            {isLastStep ? (
              <>
                <Sparkles size={18} />
                Generate Insights
              </>
            ) : (
              <>
                Continue
                <ArrowRight size={18} />
              </>
            )}
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ProgressButton;