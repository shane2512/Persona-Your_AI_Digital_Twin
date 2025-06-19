import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface LifeGoalsStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LifeGoalsStep: React.FC<LifeGoalsStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleGoalsChange = (goals: string[]) => {
    updateUserData({ lifeGoals: goals });
  };

  const isNextDisabled = userData.lifeGoals.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Your Life Goals</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Goals give direction to your life and align with your core values. 
          What meaningful achievements would you like to accomplish?
        </p>
      </div>
      
      {/* Display Core Values as Simple Tags */}
      {userData.coreValues.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 text-primary-600 dark:text-primary-400">Your Core Values</h3>
          <div className="flex flex-wrap gap-2">
            {userData.coreValues.map((value, index) => (
              <motion.span
                key={value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="chip"
              >
                {value}
              </motion.span>
            ))}
          </div>
        </div>
      )}
      
      <div className="card">
        <ChipInput 
          label="Your Life Goals"
          value={userData.lifeGoals}
          onChange={handleGoalsChange}
          placeholder="E.g., Start a business, Learn a language"
          maxChips={5}
          helperText="Add up to 5 important goals you want to achieve"
        />
        
        <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-900/10 rounded-md">
          <h4 className="text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Examples of life goals:</h4>
          <div className="flex flex-wrap gap-2">
            {['Financial independence', 'Write a book', 'Travel to 20 countries', 'Learn to play piano', 
              'Build meaningful relationships', 'Start a charity'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  if (!userData.lifeGoals.includes(example) && userData.lifeGoals.length < 5) {
                    handleGoalsChange([...userData.lifeGoals, example]);
                  }
                }}
                disabled={userData.lifeGoals.includes(example) || userData.lifeGoals.length >= 5}
                className="text-xs px-2 py-1 rounded-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 
                          hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors 
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

export default LifeGoalsStep;