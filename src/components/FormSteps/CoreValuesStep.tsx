import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface CoreValuesStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
}

const CoreValuesStep: React.FC<CoreValuesStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext 
}) => {
  const handleValuesChange = (values: string[]) => {
    updateUserData({ coreValues: values });
  };

  const isNextDisabled = userData.coreValues.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Your Core Values</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Values are the principles that guide your decisions and actions. 
          What qualities or ideals do you consider most important in your life?
        </p>
      </div>
      
      <div className="card">
        <ChipInput 
          label="Your Core Values"
          value={userData.coreValues}
          onChange={handleValuesChange}
          placeholder="E.g., Honesty, Compassion, Growth"
          maxChips={5}
          helperText="Add up to 5 core values that guide your life"
        />
        
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-md">
          <h4 className="text-sm font-semibold mb-2 text-primary-700 dark:text-primary-300">Examples of core values:</h4>
          <div className="flex flex-wrap gap-2">
            {['Integrity', 'Family', 'Freedom', 'Creativity', 'Health', 'Adventure', 'Knowledge', 'Spirituality'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  if (!userData.coreValues.includes(example) && userData.coreValues.length < 5) {
                    handleValuesChange([...userData.coreValues, example]);
                  }
                }}
                disabled={userData.coreValues.includes(example) || userData.coreValues.length >= 5}
                className="text-xs px-2 py-1 rounded-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 
                          hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors 
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
        isNextDisabled={isNextDisabled}
        isBackDisabled={true}
      />
    </motion.div>
  );
};

export default CoreValuesStep;