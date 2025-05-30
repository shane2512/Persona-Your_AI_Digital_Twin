import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { Check } from 'lucide-react';
import { FormStep } from '../types';

interface FormStepperProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
}

interface StepInfo {
  key: FormStep;
  label: string;
}

const steps: StepInfo[] = [
  { key: 'values', label: 'Core Values' },
  { key: 'goals', label: 'Life Goals' },
  { key: 'struggles', label: 'Current Struggles' },
  { key: 'idealSelf', label: 'Ideal Self' },
  { key: 'decision', label: 'Current Decision' },
  { key: 'results', label: 'AI Reflection' },
];

const FormStepper: React.FC<FormStepperProps> = ({ currentStep, completedSteps }) => {
  return (
    <div className="w-full mb-8">
      <div className="hidden sm:flex justify-between">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = completedSteps.includes(step.key);
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <motion.div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 border-2",
                    isActive 
                      ? "border-primary-600 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" 
                      : isCompleted 
                        ? "border-success-500 bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400" 
                        : "border-surface-300 bg-surface-100 text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400"
                  )}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    transition: { duration: 0.2 }
                  }}
                >
                  {isCompleted ? (
                    <Check size={18} />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </motion.div>
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary-600 dark:text-primary-400" : 
                  isCompleted ? "text-success-600 dark:text-success-400" : 
                  "text-surface-500 dark:text-surface-400"
                )}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div 
                    className={cn(
                      "h-0.5 w-full", 
                      completedSteps.includes(steps[index + 1].key) 
                        ? "bg-success-500 dark:bg-success-600" 
                        : "bg-surface-300 dark:bg-surface-700"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="block sm:hidden">
        <div className="flex justify-between items-center px-4">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            Step {steps.findIndex(s => s.key === currentStep) + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
            {steps.find(s => s.key === currentStep)?.label}
          </span>
        </div>
        <div className="mt-2 h-1 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-600 dark:bg-primary-500" 
            initial={{ width: 0 }}
            animate={{ 
              width: `${((steps.findIndex(s => s.key === currentStep) + 1) / steps.length) * 100}%` 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormStepper;