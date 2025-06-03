import React from 'react';
import { Volume2, Video, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface MediaToggleProps {
  mediaType: 'voice' | 'video' | 'none';
  onMediaTypeChange: (type: 'voice' | 'video' | 'none') => void;
  isLoading: boolean;
  error: string | null;
}

const MediaToggle: React.FC<MediaToggleProps> = ({
  mediaType,
  onMediaTypeChange,
  isLoading,
  error
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center gap-2 p-2 bg-white/90 dark:bg-surface-800/90 rounded-2xl shadow-lg">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onMediaTypeChange('voice')}
          className={cn(
            "p-3 rounded-xl flex items-center gap-2 transition-all duration-300",
            mediaType === 'voice'
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              : "hover:bg-surface-100 dark:hover:bg-surface-700"
          )}
        >
          <Volume2 size={20} />
          <span className="text-sm font-medium">Voice</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onMediaTypeChange('video')}
          className={cn(
            "p-3 rounded-xl flex items-center gap-2 transition-all duration-300",
            mediaType === 'video'
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              : "hover:bg-surface-100 dark:hover:bg-surface-700"
          )}
        >
          <Video size={20} />
          <span className="text-sm font-medium">Video</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onMediaTypeChange('none')}
          className={cn(
            "p-3 rounded-xl flex items-center gap-2 transition-all duration-300",
            mediaType === 'none'
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              : "hover:bg-surface-100 dark:hover:bg-surface-700"
          )}
        >
          <X size={20} />
          <span className="text-sm font-medium">Text</span>
        </motion.button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Generating {mediaType} response...</span>
        </div>
      )}

      {error && (
        <div className="text-error-600 dark:text-error-400 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default MediaToggle;