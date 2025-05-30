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
      <label htmlFor={`chip-input-${label}`} className="block text-sm font-medium mb-1">
        {label}
      </label>
      
      <div 
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md min-h-[80px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500",
          "bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-700"
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
              className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full text-sm"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(index);
                }}
                className="text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none"
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
            className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none p-1 text-sm"
          />
        )}
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-surface-500 dark:text-surface-400">
        {helperText && <span>{helperText}</span>}
        <span className="ml-auto">{value.length}/{maxChips}</span>
      </div>
    </div>
  );
};

export default ChipInput;