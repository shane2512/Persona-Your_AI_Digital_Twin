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
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <header className="py-6 px-6 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm border-b border-surface-200/50 dark:border-surface-800/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center animate-float">
              <Sparkles className="w-5 h-5 text-surface-900 dark:text-surface-50" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tighter">Persona Mirror</h1>
              <p className="text-sm text-surface-600 dark:text-surface-400">Reflect & Evolve</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>
      
      <main className="flex-1 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter">
              Your Path to Clarity
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed">
              Discover your authentic self through mindful reflection and AI-guided insights.
            </p>
          </motion.div>
          {children}
        </div>
      </main>
      
      <footer className="py-8 px-4 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-sm border-t border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            © {new Date().getFullYear()} Persona Mirror. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;