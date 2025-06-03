import React from 'react';
import { Moon, Sun, Wind } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col transition-colors duration-700">
      <header className="py-6 px-6 backdrop-blur-md bg-white/30 dark:bg-surface-900/30 border-b border-surface-200/50 dark:border-surface-700/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100/50 dark:bg-primary-900/30 flex items-center justify-center animate-float">
              <Wind className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-900 dark:text-primary-100">Persona Mirror</h1>
              <p className="text-sm text-surface-600 dark:text-surface-400">Find your inner calm</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={toggleDarkMode}
            className="p-3 rounded-full hover:bg-surface-100/50 dark:hover:bg-surface-800/30 transition-colors duration-300"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>
      
      <main className="flex-1 py-12 px-4 sm:px-6 md:py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-4">
              Your Journey to Inner Clarity
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Take a moment to reflect, breathe, and align your choices with your authentic self.
              Let AI guide you towards mindful decisions.
            </p>
          </motion.div>
          {children}
        </div>
      </main>
      
      <footer className="py-8 px-4 backdrop-blur-sm bg-white/30 dark:bg-surface-900/30 border-t border-surface-200/50 dark:border-surface-700/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            © {new Date().getFullYear()} Persona Mirror. Find your path to clarity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;