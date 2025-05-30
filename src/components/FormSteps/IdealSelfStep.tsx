import React from 'react';
import { motion } from 'framer-motion';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface IdealSelfStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const IdealSelfStep: React.FC<IdealSelfStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserData({ idealSelf: e.target.value });
  };

  const isNextDisabled = !userData.idealSelf || userData.idealSelf.length < 20;
  const characterCount = userData.idealSelf ? userData.idealSelf.length : 0;
  const minChars = 20;
  const maxChars = 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Your Ideal Self</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Imagine the best version of yourself. How would you describe this person? 
          What qualities, habits, and achievements would they have?
        </p>
      </div>
      
      <div className="card">
        <div className="form-group">
          <label htmlFor="ideal-self" className="block text-sm font-medium mb-1">
            Describe your ideal self
          </label>
          <textarea
            id="ideal-self"
            value={userData.idealSelf}
            onChange={handleTextChange}
            placeholder="I envision myself as someone who..."
            className="textarea"
            maxLength={maxChars}
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${characterCount < minChars ? 'text-error-500' : 'text-surface-500 dark:text-surface-400'}`}>
              {characterCount < minChars ? `At least ${minChars} characters required` : ''}
            </span>
            <span className="text-xs text-surface-500 dark:text-surface-400">
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-md">
          <h4 className="text-sm font-semibold mb-2 text-primary-700 dark:text-primary-300">Need help getting started?</h4>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
            Consider addressing these aspects in your description:
          </p>
          <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1 list-disc pl-5">
            <li>Personal qualities and character traits</li>
            <li>Daily habits and routines</li>
            <li>How you handle challenges</li>
            <li>Your impact on others and the world</li>
            <li>Balance between different life areas</li>
          </ul>
        </div>
      </div>
      
      <ProgressButton 
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
        isLastStep={true}
      />
    </motion.div>
  );
};

export default IdealSelfStep;