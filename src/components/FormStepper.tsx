import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { Check, Circle } from 'lucide-react';
import { FormStep } from '../types';

interface FormStepperProps {
  currentStep: FormStep;
  completedSteps: FormStep[];
}

interface StepInfo {
  key: FormStep;
  label: string;
  description: string;
}

const steps: StepInfo[] = [
  { key: 'values', label: 'Core Values', description: 'Define what matters most' },
  { key: 'goals', label: 'Life Goals', description: 'Set your aspirations' },
  { key: 'struggles', label: 'Current Struggles', description: 'Identify challenges' },
  { key: 'idealSelf', label: 'Ideal Self', description: 'Envision your future' },
  { key: 'decision', label: 'Current Decision', description: 'Frame your dilemma' },
  { key: 'results', label: 'AI Insights', description: 'Receive guidance' },
];

const FormStepper: React.FC<FormStepperProps> = ({ currentStep, completedSteps }) => {
  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  
  return (
    <div className="w-full mb-12">
      {/* Desktop Stepper */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = completedSteps.includes(step.key);
            const isUpcoming = index > currentStepIndex;
            
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center relative">
                  <motion.div 
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border-2 transition-all duration-500",
                      isActive 
                        ? "border-blue-500 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25" 
                        : isCompleted 
                          ? "border-green-500 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25" 
                          : isUpcoming
                            ? "border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    )}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {isCompleted ? (
                      <Check size={20} />
                    ) : isActive ? (
                      <Circle size={20} className="animate-pulse" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </motion.div>
                  
                  <div className="text-center">
                    <span className={cn(
                      "text-sm font-semibold block mb-1 transition-colors duration-300",
                      isActive ? "text-blue-600 dark:text-blue-400" : 
                      isCompleted ? "text-green-600 dark:text-green-400" : 
                      "text-slate-600 dark:text-slate-400"
                    )}>
                      {step.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {step.description}
                    </span>
                  </div>
                  
                  {/* Progress indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -bottom-2 w-2 h-2 bg-blue-500 rounded-full"
                    />
                  )}
                </div>
                
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center px-4">
                    <div className="relative w-full h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: completedSteps.includes(steps[index + 1].key) ? "100%" : 
                                 index < currentStepIndex ? "100%" : "0%"
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      
      {/* Mobile Stepper */}
      <div className="block lg:hidden">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {steps[currentStepIndex]?.label}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {steps[currentStepIndex]?.description}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              {currentStepIndex + 1}
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" 
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentStepIndex + 1) / steps.length) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <div
                  key={step.key}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    index <= currentStepIndex 
                      ? "bg-blue-500" 
                      : "bg-slate-300 dark:bg-slate-600"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStepper;