import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-700 overflow-hidden">
      <div className="fixed inset-0 bg-noise mix-blend-soft-light pointer-events-none" />
      
      <div className="fixed inset-0 bg-gradient-radial from-calm-400/5 via-transparent to-transparent dark:from-calm-600/10" />
      
      <header className="relative py-6 px-6 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-calm-100/50 dark:border-calm-800/50 sticky top-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-calm-50/50 via-transparent to-calm-50/50 dark:from-calm-900/20 dark:to-calm-900/20" />
        
        <div className="relative max-w-6xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-calm-400 to-calm-500 dark:from-calm-500 dark:to-calm-600 flex items-center justify-center animate-float shadow-lg shadow-calm-400/20 dark:shadow-calm-500/20">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
              <Sparkles className="w-7 h-7 text-white animate-pulse-calm" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tighter bg-gradient-to-r from-calm-600 to-calm-500 dark:from-calm-400 dark:to-calm-300 bg-clip-text text-transparent">
                Persona Mirror
              </h1>
              <p className="text-sm text-calm-600 dark:text-calm-400">Find Your Inner Peace</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={toggleDarkMode}
            className="relative p-3 rounded-xl bg-white/50 dark:bg-surface-700/50 hover:bg-calm-50 dark:hover:bg-calm-900/30 transition-colors duration-300 shadow-lg shadow-calm-400/10 dark:shadow-calm-500/10"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent" />
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>
      
      <main className="relative flex-1 py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20 space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter bg-gradient-to-r from-calm-600 to-calm-500 dark:from-calm-400 dark:to-calm-300 bg-clip-text text-transparent">
              Your Journey to Inner Peace
            </h2>
            <p className="text-lg md:text-xl text-calm-600 dark:text-calm-400 max-w-2xl mx-auto leading-relaxed">
              Take a moment to reflect, breathe, and discover your authentic self through mindful guidance.
            </p>
          </motion.div>
          {children}
        </div>
      </main>
      
      <footer className="relative py-10 px-4 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-t border-calm-100/50 dark:border-calm-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-calm-50/50 via-transparent to-calm-50/50 dark:from-calm-900/20 dark:to-calm-900/20" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <p className="text-sm text-calm-500 dark:text-calm-400">
            © {new Date().getFullYear()} Persona Mirror. Your journey to mindfulness.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;