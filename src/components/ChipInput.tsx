import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

interface ChipInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxChips?: number;
  helperText?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type and press Enter',
  maxChips = 5,
  helperText,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addChip = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText && !value.includes(trimmedText) && value.length < maxChips) {
      onChange([...value, trimmedText]);
      setInputValue('');
    }
  };

  const removeChip = (index: number) => {
    const newChips = [...value];
    newChips.splice(index, 1);
    onChange(newChips);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addChip(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeChip(value.length - 1);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={`chip-input-${label}`} className="block text-base font-medium mb-2 text-calm-700 dark:text-calm-200">
        {label}
      </label>
      
      <div 
        className={cn(
          "relative flex flex-wrap gap-2 p-4 rounded-2xl min-h-[100px]",
          "bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm",
          "border-2 border-calm-200/80 dark:border-calm-400/30",
          "shadow-[0_4px_12px_-2px_rgba(14,165,233,0.1)]",
          "dark:shadow-[0_4px_12px_-2px_rgba(56,189,248,0.2)]",
          "focus-within:ring-2 focus-within:ring-calm-500/30 focus-within:border-calm-500/50",
          "dark:focus-within:ring-calm-400/50 dark:focus-within:border-calm-400/70",
          "transition-all duration-300"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <AnimatePresence>
          {value.map((chip, index) => (
            <motion.div
              key={`${chip}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl",
                "bg-calm-100/80 dark:bg-calm-400/20",
                "border border-calm-200 dark:border-calm-400/40",
                "text-calm-700 dark:text-calm-200",
                "shadow-[0_2px_4px_rgba(14,165,233,0.06)]",
                "dark:shadow-[0_2px_4px_rgba(56,189,248,0.1)]",
                "group hover:bg-calm-200/80 dark:hover:bg-calm-400/30",
                "transition-all duration-300"
              )}
            >
              <span className="text-sm font-medium">{chip}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(index);
                }}
                className={cn(
                  "p-1 rounded-full",
                  "text-calm-500 hover:text-calm-700 dark:text-calm-300 dark:hover:text-calm-100",
                  "hover:bg-calm-200 dark:hover:bg-calm-400/40",
                  "focus:outline-none focus:ring-2 focus:ring-calm-500/30 dark:focus:ring-calm-400/50",
                  "transition-colors duration-200"
                )}
                aria-label={`Remove ${chip}`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {value.length < maxChips && (
          <input
            ref={inputRef}
            id={`chip-input-${label}`}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={value.length === 0 ? placeholder : ''}
            className={cn(
              "flex-1 min-w-[120px] bg-transparent border-none p-1.5",
              "text-sm text-calm-700 dark:text-calm-100",
              "placeholder-calm-400/80 dark:placeholder-calm-400/60",
              "focus:outline-none focus:ring-0"
            )}
          />
        )}
      </div>
      
      <div className="flex justify-between mt-2 text-xs">
        {helperText && (
          <span className="text-calm-600 dark:text-calm-400">{helperText}</span>
        )}
        <span className={cn(
          "ml-auto",
          value.length >= maxChips ? "text-calm-500 dark:text-calm-400" : "text-calm-400 dark:text-calm-500"
        )}>
          {value.length}/{maxChips}
        </span>
      </div>
    </div>
  );
};

export default ChipInput;