import React from 'react';
import { cn } from '../utils/cn';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="flex justify-between mt-8">
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onBack}
        disabled={isBackDisabled}
        className={cn(
          "btn btn-outline flex items-center gap-2",
          isBackDisabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <ArrowLeft size={16} />
        Back
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        type="button"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className={cn(
          "btn btn-primary flex items-center gap-2",
          (isNextDisabled || isLoading) && "opacity-70 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            {isLastStep ? 'Generate Reflection' : 'Next'}
            <ArrowRight size={16} />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ProgressButton;