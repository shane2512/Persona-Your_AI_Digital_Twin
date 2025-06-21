import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
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
      <label htmlFor={`chip-input-${label}`} className="block text-lg font-semibold mb-3 text-slate-900 dark:text-white">
        {label}
      </label>
      
      <div 
        className={cn(
          "relative flex flex-wrap gap-3 p-6 rounded-2xl min-h-[120px] transition-all duration-300 cursor-text",
          "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
          "border-2 transition-all duration-300",
          isFocused 
            ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-white dark:bg-slate-800" 
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        )}
        onClick={() => inputRef.current?.focus()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <AnimatePresence>
          {value.map((chip, index) => (
            <motion.div
              key={`${chip}-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 group hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-200"
            >
              <span className="text-sm font-medium">{chip}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(index);
                }}
                className="p-1 rounded-full hover:bg-blue-200/50 dark:hover:bg-blue-800/50 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors duration-200"
                aria-label={`Remove ${chip}`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {value.length < maxChips && (
          <div className="flex items-center gap-2 min-w-[200px]">
            <Plus size={16} className="text-slate-400 dark:text-slate-500" />
            <input
              ref={inputRef}
              id={`chip-input-${label}`}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={value.length === 0 ? placeholder : 'Add another...'}
              className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-3 text-sm">
        {helperText && (
          <span className="text-slate-600 dark:text-slate-400">{helperText}</span>
        )}
        <span className={cn(
          "ml-auto font-medium",
          value.length >= maxChips ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"
        )}>
          {value.length}/{maxChips}
        </span>
      </div>
    </div>
  );
};

export default ChipInput;