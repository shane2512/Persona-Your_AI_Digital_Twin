import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface CurrentStrugglesStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CurrentStrugglesStep: React.FC<CurrentStrugglesStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleStrugglesChange = (struggles: string[]) => {
    updateUserData({ currentStruggles: struggles });
  };

  const isNextDisabled = userData.currentStruggles.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Current Struggles</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          We all face challenges on our journey. What obstacles or difficulties are you currently dealing with?
        </p>
      </div>
      
      <div className="card">
        <ChipInput 
          label="Your Current Struggles"
          value={userData.currentStruggles}
          onChange={handleStrugglesChange}
          placeholder="E.g., Work-life balance, Procrastination"
          maxChips={5}
          helperText="Add up to 5 challenges you're currently facing"
        />
        
        <div className="mt-6 p-4 bg-accent-50 dark:bg-accent-900/10 rounded-md">
          <h4 className="text-sm font-semibold mb-2 text-accent-700 dark:text-accent-300">Common struggles people face:</h4>
          <div className="flex flex-wrap gap-2">
            {['Self-doubt', 'Lack of motivation', 'Career uncertainty', 'Financial stress', 
              'Relationship challenges', 'Health issues', 'Finding purpose'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  if (!userData.currentStruggles.includes(example) && userData.currentStruggles.length < 5) {
                    handleStrugglesChange([...userData.currentStruggles, example]);
                  }
                }}
                disabled={userData.currentStruggles.includes(example) || userData.currentStruggles.length >= 5}
                className="text-xs px-2 py-1 rounded-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 
                          hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors 
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <ProgressButton 
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default CurrentStrugglesStep;