import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, MessageCircle, History } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface UserMenuProps {
  onChatOpen: () => void
}

const UserMenu: React.FC<UserMenuProps> = ({ onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0]?.toUpperCase() || 'U'
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email || 'User'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-surface-700/50 hover:bg-calm-50 dark:hover:bg-calm-900/30 transition-colors duration-300 shadow-lg shadow-calm-400/10 dark:shadow-calm-500/10"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-calm-400 to-calm-500 dark:from-calm-500 dark:to-calm-600 flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
        <span className="hidden sm:block text-sm font-medium text-calm-700 dark:text-calm-200">
          {getUserDisplayName()}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-calm-100 dark:border-calm-400/30 z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-calm-100 dark:border-calm-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-calm-400 to-calm-500 dark:from-calm-500 dark:to-calm-600 flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-calm-700 dark:text-calm-200">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    onChatOpen()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-calm-50 dark:hover:bg-calm-900/30 transition-colors text-left"
                >
                  <MessageCircle size={18} className="text-calm-500 dark:text-calm-400" />
                  <span className="text-sm font-medium text-calm-700 dark:text-calm-200">
                    AI Chat Assistant
                  </span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left"
                >
                  <LogOut size={18} className="text-red-500 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Sign Out
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu