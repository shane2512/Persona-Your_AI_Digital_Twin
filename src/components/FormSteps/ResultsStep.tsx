import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Share2, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { UserData } from '../../types';
import { cn } from '../../utils/cn';
import { getRandomQuote } from '../../utils/quotes';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { geminiAPI } from '../../utils/apiClient';

interface ResultsStepProps {
  userData: UserData;
  onBack: () => void;
  onReset: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ userData, onBack, onReset }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPastAdvice, setShowPastAdvice] = useState(false);
  const [pastAdvice, setPastAdvice] = useState<any[]>([]);
  const [mood, setMood] = useState<string>('');
  const [quote, setQuote] = useState(getRandomQuote());
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Generating reflection for user data:', userData);
        
        const response = await geminiAPI.generateReflection(userData);
        
        if (response && response.advice) {
          setAdvice(response.advice);
          
          // Save to Supabase if user is authenticated and Supabase is configured
          if (user && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
            try {
              const { error: saveError } = await supabase
                .from('reflections')
                .insert({
                  user_id: user.id,
                  core_values: userData.coreValues,
                  life_goals: userData.lifeGoals,
                  current_struggles: userData.currentStruggles,
                  ideal_self: userData.idealSelf,
                  current_decision: userData.currentDecision,
                  ai_advice: response.advice,
                  mood,
                  quote_text: quote.text,
                  quote_author: quote.author
                });

              if (saveError) {
                console.error('Error saving reflection:', saveError);
                // Fall back to localStorage if Supabase fails
                saveToLocalStorage(response.advice);
              }
            } catch (saveError) {
              console.error('Error saving to Supabase:', saveError);
              // Fall back to localStorage if Supabase fails
              saveToLocalStorage(response.advice);
            }
          } else {
            // Save to localStorage for non-authenticated users or when Supabase is not configured
            saveToLocalStorage(response.advice);
          }
          
          // Load past reflections
          await loadPastReflections();
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: any) {
        console.error('Error fetching advice:', err);
        
        // Fallback advice if API fails
        const fallbackAdvice = generateFallbackAdvice(userData);
        setAdvice(fallbackAdvice);
        
        let errorMsg = 'Using offline reflection mode. ';
        if (err.message?.includes('401') || err.message?.includes('API Error (401)')) {
          errorMsg += 'API authentication issue. ';
        } else if (err.message?.includes('429') || err.message?.includes('rate limit')) {
          errorMsg += 'API rate limit reached. ';
        } else if (err.message?.includes('timeout') || err.message?.includes('Network error')) {
          errorMsg += 'Connection timeout. ';
        }
        errorMsg += 'For AI-powered insights, please try again later.';
        
        setError(errorMsg);
        
        // Save fallback advice
        if (user && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
          try {
            await supabase
              .from('reflections')
              .insert({
                user_id: user.id,
                core_values: userData.coreValues,
                life_goals: userData.lifeGoals,
                current_struggles: userData.currentStruggles,
                ideal_self: userData.idealSelf,
                current_decision: userData.currentDecision,
                ai_advice: fallbackAdvice,
                mood,
                quote_text: quote.text,
                quote_author: quote.author
              });
          } catch (saveError) {
            console.error('Error saving fallback to Supabase:', saveError);
            saveToLocalStorage(fallbackAdvice);
          }
        } else {
          saveToLocalStorage(fallbackAdvice);
        }
        
        await loadPastReflections();
      } finally {
        setLoading(false);
      }
    };

    const saveToLocalStorage = (adviceText: string) => {
      const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]');
      const newReflection = {
        id: Date.now(),
        date: new Date().toISOString(),
        userData,
        advice: adviceText,
        mood,
        quote
      };
      
      localStorage.setItem('personaMirrorReflections', 
        JSON.stringify([newReflection, ...savedReflections].slice(0, 10)));
    };

    const loadPastReflections = async () => {
      if (user && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        try {
          const { data: reflections, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (error) throw error;
          setPastAdvice(reflections || []);
        } catch (error) {
          console.error('Error loading reflections from Supabase:', error);
          // Fall back to localStorage
          const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]');
          setPastAdvice(savedReflections);
        }
      } else {
        const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]');
        setPastAdvice(savedReflections);
      }
    };

    fetchAdvice();
  }, [userData, mood, quote, user]);

  const generateFallbackAdvice = (data: UserData): string => {
    const { coreValues, lifeGoals, currentStruggles, idealSelf, currentDecision } = data;
    
    return `Based on your reflection, here are some insights:

**Your Core Values**: ${coreValues.join(', ')}
These values are your compass. When making decisions, ask yourself: "Which option best aligns with these principles?"

**Your Goals**: ${lifeGoals.join(', ')}
Break these down into smaller, actionable steps. Focus on progress, not perfection.

**Current Challenges**: ${currentStruggles.join(', ')}
Remember that challenges are opportunities for growth. Consider how overcoming these obstacles will make you stronger.

**Your Ideal Self**: 
${idealSelf}

This vision is powerful. Take one small action today that moves you closer to this version of yourself.

**Decision Framework**:
When facing your current decision about "${currentDecision}", consider:
1. Which option aligns best with your core values?
2. Which choice moves you closer to your ideal self?
3. What would you regret not trying?

Trust yourself - you have the wisdom to make the right choice.`;
  };

  const copyToClipboard = async () => {
    if (!advice) return;
    
    try {
      await navigator.clipboard.writeText(advice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsText = () => {
    if (!advice) return;
    
    const element = document.createElement('a');
    const file = new Blob([
      `# Persona Mirror Reflection\n\nDate: ${new Date().toLocaleDateString()}\n\n${advice}\n\n---\n${quote.text}\n- ${quote.author}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'persona-mirror-reflection.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareAdvice = async () => {
    if (!advice) return;
    
    try {
      await navigator.share({
        title: 'My Persona Mirror Reflection',
        text: advice,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">
          Your Personalized Reflection
        </h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Based on your values, goals, struggles, and vision of your ideal self.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">How are you feeling right now?</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="input"
        >
          <option value="">Select your mood...</option>
          <option value="optimistic">😊 Optimistic</option>
          <option value="neutral">😐 Neutral</option>
          <option value="anxious">😟 Anxious</option>
          <option value="motivated">💪 Motivated</option>
          <option value="confused">🤔 Confused</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-primary-600 dark:text-primary-400">Generating your personalized reflection...</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">This may take a moment as we analyze your inputs.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                <p className="text-amber-800 dark:text-amber-200 text-sm">{error}</p>
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {advice?.split('\n\n').map((paragraph, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="font-serif"
                >
                  {paragraph.startsWith('**') ? (
                    <div className="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">
                      {paragraph.replace(/\*\*/g, '')}
                    </div>
                  ) : (
                    <p className="mb-4">{paragraph}</p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mt-6">
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <Quote size={16} />
                <p className="italic text-sm">{quote.text}</p>
              </div>
              <p className="text-right text-sm text-surface-500 dark:text-surface-400">- {quote.author}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                onClick={copyToClipboard}
                className={cn(
                  "btn btn-outline flex items-center gap-2",
                  copied && "bg-success-50 text-success-700 border-success-300 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800"
                )}
              >
                {copied ? "Copied!" : (
                  <>
                    <Share2 size={16} />
                    Copy
                  </>
                )}
              </button>
              
              <button
                onClick={downloadAsText}
                className="btn btn-outline flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>

              {navigator.share && (
                <button
                  onClick={shareAdvice}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {pastAdvice.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowPastAdvice(!showPastAdvice)}
            className="btn btn-outline w-full flex items-center justify-between"
          >
            <span>Compare with Past Reflections</span>
            {showPastAdvice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showPastAdvice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                {pastAdvice.map((reflection) => (
                  <div key={reflection.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(reflection.created_at || reflection.date).toLocaleDateString()}
                        </p>
                        {reflection.mood && (
                          <p className="text-sm text-surface-500 dark:text-surface-400">
                            Mood: {reflection.mood}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-sm dark:prose-invert">
                      {(reflection.ai_advice || reflection.advice).split('\n\n').slice(0, 2).map((paragraph, i) => (
                        <p key={i} className="font-serif">{paragraph}</p>
                      ))}
                      {(reflection.ai_advice || reflection.advice).split('\n\n').length > 2 && (
                        <p className="text-surface-500 dark:text-surface-400">...</p>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onBack}
          className="btn btn-outline flex items-center gap-2"
        >
          Edit Inputs
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          type="button"
          onClick={onReset}
          className="btn btn-primary flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Start New Reflection
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsStep;