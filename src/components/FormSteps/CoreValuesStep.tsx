import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';
import { Heart, Compass, Star } from 'lucide-react';

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

  const valueCategories = [
    {
      title: "Personal Growth",
      values: ["Learning", "Creativity", "Self-improvement", "Wisdom", "Curiosity"]
    },
    {
      title: "Relationships",
      values: ["Family", "Friendship", "Love", "Community", "Compassion"]
    },
    {
      title: "Achievement",
      values: ["Success", "Excellence", "Leadership", "Innovation", "Recognition"]
    },
    {
      title: "Lifestyle",
      values: ["Freedom", "Adventure", "Balance", "Health", "Security"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/25"
        >
          <Heart size={32} className="text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
        >
          What matters most to you?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          Your core values are the fundamental beliefs that guide your decisions and shape your character. 
          They're your moral compass in life's journey.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <ChipInput 
          label="Your Core Values"
          value={userData.coreValues}
          onChange={handleValuesChange}
          placeholder="Type a value and press Enter..."
          maxChips={5}
          helperText="Choose up to 5 values that define who you are at your core"
        />
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Compass size={20} className="text-blue-600 dark:text-blue-400" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Need inspiration? Explore these categories:</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {valueCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-blue-600 dark:text-blue-400" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{category.title}</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (!userData.coreValues.includes(value) && userData.coreValues.length < 5) {
                          handleValuesChange([...userData.coreValues, value]);
                        }
                      }}
                      disabled={userData.coreValues.includes(value) || userData.coreValues.length >= 5}
                      className={`px-3 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                        userData.coreValues.includes(value)
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <ProgressButton 
        onNext={onNext}
        isNextDisabled={isNextDisabled}
        isBackDisabled={true}
      />
    </motion.div>
  );
};

export default CoreValuesStep;