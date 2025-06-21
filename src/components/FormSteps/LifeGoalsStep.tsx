import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';
import { Target, TrendingUp, Zap } from 'lucide-react';

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

  const goalCategories = [
    {
      title: "Career & Professional",
      goals: ["Start a business", "Get promoted", "Change careers", "Learn new skills", "Build a network"]
    },
    {
      title: "Personal Development",
      goals: ["Read 50 books", "Learn a language", "Master a hobby", "Improve confidence", "Develop leadership"]
    },
    {
      title: "Health & Wellness",
      goals: ["Run a marathon", "Eat healthier", "Meditate daily", "Lose weight", "Build strength"]
    },
    {
      title: "Relationships & Life",
      goals: ["Travel the world", "Buy a home", "Start a family", "Strengthen friendships", "Give back to community"]
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
          className="w-16 h-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25"
        >
          <Target size={32} className="text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
        >
          What do you want to achieve?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          Your life goals give direction to your journey and align with your core values. 
          What meaningful achievements would make you proud?
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <ChipInput 
          label="Your Life Goals"
          value={userData.lifeGoals}
          onChange={handleGoalsChange}
          placeholder="Type a goal and press Enter..."
          maxChips={5}
          helperText="Choose up to 5 important goals you want to achieve"
        />
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Explore different areas of life:</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {goalCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="p-6 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-800/50 dark:to-green-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-green-600 dark:text-green-400" />
                  <h5 className="font-bold text-slate-900 dark:text-white">{category.title}</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.goals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        if (!userData.lifeGoals.includes(goal) && userData.lifeGoals.length < 5) {
                          handleGoalsChange([...userData.lifeGoals, goal]);
                        }
                      }}
                      disabled={userData.lifeGoals.includes(goal) || userData.lifeGoals.length >= 5}
                      className={`px-3 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                        userData.lifeGoals.includes(goal)
                          ? 'bg-green-600 text-white shadow-lg'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {goal}
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
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default LifeGoalsStep;