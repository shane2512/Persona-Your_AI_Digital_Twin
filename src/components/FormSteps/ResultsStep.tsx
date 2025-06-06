import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, Share2, ChevronDown, ChevronUp, Quote, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserData } from '../../types';
import { cn } from '../../utils/cn';
import { getRandomQuote } from '../../utils/quotes';
import MediaToggle from '../MediaToggle';
import { generateAdvice, generateVoice, generateVideo, APIError } from '../../utils/api';

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
  
  // Media state
  const [mediaType, setMediaType] = useState<'voice' | 'video' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [enableMedia, setEnableMedia] = useState(true);
  const [preferredMedia, setPreferredMedia] = useState<'voice' | 'video'>('voice');
  const [showSettings, setShowSettings] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const adviceText = await generateAdvice(userData);
        setAdvice(adviceText);
        
        if (enableMedia) {
          try {
            if (mediaType === 'voice') {
              const audioUrl = await generateVoice(adviceText);
              setMediaUrl(audioUrl);
              if (audioRef.current) {
                audioRef.current.play();
              }
            } else if (mediaType === 'video') {
              const videoUrl = await generateVideo(adviceText);
              setMediaUrl(videoUrl);
              if (videoRef.current) {
                videoRef.current.play();
              }
            }
          } catch (mediaError: any) {
            if (mediaError instanceof APIError) {
              setMediaError(mediaError.message);
            } else {
              setMediaError('Media generation failed. Showing text response instead.');
            }
            setMediaType('none');
          }
        }
        
        // Update local storage with new reflection
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
        
        setPastAdvice(savedReflections);
      } catch (err: any) {
        console.error('Error:', err);
        if (err instanceof APIError) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError('Failed to generate advice. Please try again.');
          toast.error('Something went wrong. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [userData, mood, quote, enableMedia, mediaType]);

  const handleMediaTypeChange = (type: 'voice' | 'video' | 'none') => {
    setMediaType(type);
    if (type !== 'none' && advice) {
      generateMedia(advice);
    }
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

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-outline p-2"
        >
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Media Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable Media Output</span>
              <button
                onClick={() => setEnableMedia(!enableMedia)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  enableMedia ? "bg-primary-600" : "bg-surface-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    enableMedia ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
            
            {enableMedia && (
              <div className="flex items-center justify-between">
                <span>Preferred Media Type</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreferredMedia('voice')}
                    className={cn(
                      "px-3 py-1 rounded-lg",
                      preferredMedia === 'voice' ? "bg-primary-100 text-primary-600" : "bg-surface-100"
                    )}
                  >
                    Voice
                  </button>
                  <button
                    onClick={() => setPreferredMedia('video')}
                    className={cn(
                      "px-3 py-1 rounded-lg",
                      preferredMedia === 'video' ? "bg-primary-100 text-primary-600" : "bg-surface-100"
                    )}
                  >
                    Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      <MediaToggle
        mediaType={mediaType}
        onMediaTypeChange={handleMediaTypeChange}
        isLoading={mediaLoading}
        error={mediaError}
      />

      <div className="card">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-medium text-primary-600 dark:text-primary-400">Generating your personalized reflection...</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">This may take a moment as we analyze your inputs.</p>
          </div>
        ) : error ? (
          <div className="text-center text-error-600 dark:text-error-400 py-8">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn btn-outline text-error-600 dark:text-error-400 border-error-300 dark:border-error-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {mediaType === 'voice' && mediaUrl && (
              <audio
                ref={audioRef}
                src={mediaUrl}
                controls
                className="w-full"
                onError={() => setMediaError('Audio playback failed')}
              />
            )}

            {mediaType === 'video' && mediaUrl && (
              <video
                ref={videoRef}
                src={mediaUrl}
                controls
                className="w-full rounded-lg"
                onError={() => setMediaError('Video playback failed')}
              />
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {advice?.split('\n\n').map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="font-serif"
                >
                  {paragraph}
                </motion.p>
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
                          {new Date(reflection.date).toLocaleDateString()}
                        </p>
                        {reflection.mood && (
                          <p className="text-sm text-surface-500 dark:text-surface-400">
                            Mood: {reflection.mood}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-sm dark:prose-invert">
                      {reflection.advice.split('\n\n').slice(0, 2).map((paragraph, i) => (
                        <p key={i} className="font-serif">{paragraph}</p>
                      ))}
                      {reflection.advice.split('\n\n').length > 2 && (
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