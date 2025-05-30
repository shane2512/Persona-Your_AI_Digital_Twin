import React from 'react';
import { Moon, Sun } from 'lucide-react';
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
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      darkMode ? "bg-surface-900 text-surface-50" : "bg-surface-50 text-surface-900",
    )}>
      <header className="py-4 px-6 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="text-primary-600 dark:text-primary-400"
              >
                <path d="M2 12c0-3.5 2.5-6 6.5-6 4 0 6 2.5 6 6 0 3.5-2 6-6 6s-4.5-2.5-6.5-6Z"/>
                <path d="M8.5 6C13 6 15 9 15 12c0 6-6.5 6-6.5 6"/>
                <path d="M8.5 18c5 0 6-3 6-6"/>
                <path d="M9.5 6c4.5 0 6.5 3 6.5 6 0 6-6.5 6-6.5 6"/>
                <path d="M9.5 18c5 0 6.5-3 6.5-6"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold m-0">Persona Mirror</h1>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4 sm:px-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-4 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-500">
        <div className="max-w-7xl mx-auto">
          <p className="mb-0">© {new Date().getFullYear()} Persona Mirror. Your reflections are saved locally.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;