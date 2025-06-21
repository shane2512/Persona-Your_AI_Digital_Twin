import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Brain, Target, Lightbulb, Sparkles } from 'lucide-react';

interface ReflectionInputProps {
  onStartReflection: () => void;
  onBack: () => void;
}

const ReflectionInput: React.FC<ReflectionInputProps> = ({ onStartReflection, onBack }) => {
  const [mood, setMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [goals, setGoals] = useState('');

  const moods = [
    { value: 'excited', label: '😊 Excited', color: 'from-green-500 to-emerald-600' },
    { value: 'neutral', label: '😐 Neutral', color: 'from-slate-500 to-slate-600' },
    { value: 'anxious', label: '😟 Anxious', color: 'from-yellow-500 to-orange-600' },
    { value: 'motivated', label: '💪 Motivated', color: 'from-blue-500 to-purple-600' },
    { value: 'confused', label: '🤔 Confused', color: 'from-purple-500 to-pink-600' },
    { value: 'hopeful', label: '🌟 Hopeful', color: 'from-cyan-500 to-blue-600' },
  ];

  const isFormValid = mood && reflection.length >= 20 && goals.length >= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white"
        >
          Let's start your
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> reflection journey</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
        >
          Share what's on your mind, and our AI will guide you through a personalized reflection 
          process to help you make better decisions.
        </motion.p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-8"
      >
        {/* Mood Selection */}
        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">How are you feeling right now?</h3>
              <p className="text-slate-600 dark:text-slate-400">Your current mood helps us understand your perspective.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moods.map((moodOption) => (
              <button
                key={moodOption.value}
                onClick={() => setMood(moodOption.value)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  mood === moodOption.value
                    ? `border-blue-500 bg-gradient-to-r ${moodOption.color} text-white shadow-xl scale-105`
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">{moodOption.label.split(' ')[0]}</div>
                  <div className="text-sm font-semibold">{moodOption.label.split(' ').slice(1).join(' ')}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Text */}
        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">What's on your mind?</h3>
              <p className="text-slate-600 dark:text-slate-400">Share what you're thinking about, struggling with, or trying to decide.</p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="I'm currently thinking about... I'm struggling with... I need to decide..."
              className="textarea min-h-[150px] text-lg"
              maxLength={1000}
            />
            <div className="flex justify-between text-sm">
              <span className={`${reflection.length < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {reflection.length < 20 ? `At least ${20 - reflection.length} more characters needed` : 'Great! Keep going if you want to share more.'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {reflection.length}/1000
              </span>
            </div>
          </div>
        </div>

        {/* Goals & Aspirations */}
        <div className="card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">What are your goals?</h3>
              <p className="text-slate-600 dark:text-slate-400">Tell us about your aspirations and what you want to achieve.</p>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="I want to achieve... My goals include... I'm working towards..."
              className="textarea min-h-[120px] text-lg"
              maxLength={500}
            />
            <div className="flex justify-between text-sm">
              <span className={`${goals.length < 10 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {goals.length < 10 ? `At least ${10 - goals.length} more characters needed` : 'Perfect! Your goals help us provide better guidance.'}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {goals.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={16} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">Tips for better insights</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be honest about your current situation and feelings</li>
                <li>• Include specific details about what you're facing</li>
                <li>• Mention any constraints or factors influencing your decision</li>
                <li>• Share what success looks like to you</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft size={18} />
          Back to Home
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: isFormValid ? 1.02 : 1 }}
          onClick={onStartReflection}
          disabled={!isFormValid}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl ${
            isFormValid
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
              : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles size={20} />
          Begin Reflection
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReflectionInput;