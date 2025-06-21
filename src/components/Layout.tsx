import React, { useState } from 'react';
import { Moon, Sun, Sparkles, LogIn, UserPlus, MessageCircle, Zap, Brain, Target } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const { user, loading } = useAuth();

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

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleChatOpen = () => {
    if (!user) {
      openAuthModal('signin');
    } else {
      setChatBotOpen(true);
    }
  };

  // Navigation function to go back to landing page
  const navigateToLanding = () => {
    // Trigger a page refresh to go back to the landing page
    // This works with your current app structure
    window.location.href = '/';
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-all duration-700 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950"
      style={{ 
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Header */}
      <header 
        className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0"
        style={{ zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              onClick={navigateToLanding}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-300 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  Persona Mirror
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Your Digital Twin for Daily Decisions</p>
              </div>
            </motion.button>
            
            <div className="flex items-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <UserMenu onChatOpen={() => setChatBotOpen(true)} />
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openAuthModal('signin')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <LogIn size={16} />
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                      >
                        <UserPlus size={16} />
                        Get Started
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </motion.button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative flex-1" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Content Area */}
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={handleChatOpen}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Open AI Chat Assistant"
        style={{ zIndex: 50 }}
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-2xl bg-blue-400 animate-ping opacity-20"></div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {user ? 'Chat with AI Assistant' : 'Sign in to chat with AI'}
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"></div>
        </div>
      </motion.button>
      
      {/* Footer */}
      <footer 
        className="relative backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-slate-700/50"
        style={{ zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Persona Mirror. Empowering authentic decisions through AI.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <ChatBot
        isOpen={chatBotOpen}
        onClose={() => setChatBotOpen(false)}
      />
    </div>
  );
};

export default Layout;