import React from 'react';
import { motion } from 'framer-motion';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface DecisionStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DecisionStep: React.FC<DecisionStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserData({ currentDecision: e.target.value });
  };

  const isNextDisabled = !userData.currentDecision || userData.currentDecision.length < 20;
  const characterCount = userData.currentDecision ? userData.currentDecision.length : 0;
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
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Current Decision or Dilemma</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          What important decision or dilemma are you currently facing? Describe the situation and what makes it challenging.
        </p>
      </div>
      
      <div className="card">
        <div className="form-group">
          <label htmlFor="current-decision" className="block text-sm font-medium mb-1">
            Describe your current decision or dilemma
          </label>
          <textarea
            id="current-decision"
            value={userData.currentDecision}
            onChange={handleTextChange}
            placeholder="I'm currently trying to decide..."
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
        
        <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-900/10 rounded-md">
          <h4 className="text-sm font-semibold mb-2 text-secondary-700 dark:text-secondary-300">Tips for describing your decision:</h4>
          <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-1 list-disc pl-5">
            <li>What are the main options you're considering?</li>
            <li>What's at stake in this decision?</li>
            <li>What factors are making this choice difficult?</li>
            <li>What potential outcomes are you concerned about?</li>
            <li>How does this decision relate to your values and goals?</li>
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

export default DecisionStep;