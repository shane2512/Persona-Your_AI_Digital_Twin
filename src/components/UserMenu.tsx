import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, MessageCircle, History, Trash2, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface UserMenuProps {
  onChatOpen: () => void
  isMobile?: boolean
}

const UserMenu: React.FC<UserMenuProps> = ({ onChatOpen, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showReflections, setShowReflections] = useState(false)
  const [reflections, setReflections] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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

  const loadReflections = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Try to load from Supabase first
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('reflections')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        setReflections(data || [])
      } else {
        // Fall back to localStorage
        const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]')
        setReflections(savedReflections.slice(0, 10))
      }
    } catch (error) {
      console.error('Error loading reflections:', error)
      // Fall back to localStorage if Supabase fails
      const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]')
      setReflections(savedReflections.slice(0, 10))
    } finally {
      setLoading(false)
    }
  }

  const deleteReflection = async (reflectionId: string) => {
    try {
      // Try to delete from Supabase first
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('reflections')
          .delete()
          .eq('id', reflectionId)
          .eq('user_id', user?.id)

        if (error) throw error
      } else {
        // Delete from localStorage
        const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]')
        const updatedReflections = savedReflections.filter((r: any) => r.id !== reflectionId)
        localStorage.setItem('personaMirrorReflections', JSON.stringify(updatedReflections))
      }

      // Update local state
      setReflections(prev => prev.filter(r => r.id !== reflectionId))
    } catch (error) {
      console.error('Error deleting reflection:', error)
      // Try localStorage fallback
      const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]')
      const updatedReflections = savedReflections.filter((r: any) => r.id !== reflectionId)
      localStorage.setItem('personaMirrorReflections', JSON.stringify(updatedReflections))
      setReflections(prev => prev.filter(r => r.id !== reflectionId))
    }
  }

  const handleReflectionsToggle = () => {
    if (!showReflections) {
      loadReflections()
    }
    setShowReflections(!showReflections)
  }

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {getUserInitials()}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-white text-sm">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={onChatOpen}
          className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-medium transition-colors"
        >
          <MessageCircle size={18} />
          AI Chat Assistant
        </button>

        <button
          onClick={handleReflectionsToggle}
          className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl font-medium transition-colors"
        >
          <History size={18} />
          Past Reflections
        </button>

        <AnimatePresence>
          {showReflections && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 max-h-64 overflow-y-auto"
            >
              {loading ? (
                <div className="p-4 text-center text-slate-500">Loading reflections...</div>
              ) : reflections.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No reflections yet</div>
              ) : (
                reflections.map((reflection) => (
                  <div key={reflection.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-xs text-slate-500">
                          {new Date(reflection.created_at || reflection.date).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteReflection(reflection.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      <p><strong>Values:</strong> {(reflection.core_values || []).join(', ') || 'None'}</p>
                      <p><strong>Goals:</strong> {(reflection.life_goals || []).join(', ') || 'None'}</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl font-medium transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/70 transition-colors duration-300 shadow-lg shadow-slate-400/10 dark:shadow-slate-500/10"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
          {getUserInitials()}
        </div>
        <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-slate-200">
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
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-left"
                >
                  <MessageCircle size={18} className="text-blue-500 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    AI Chat Assistant
                  </span>
                </button>

                <button
                  onClick={handleReflectionsToggle}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-left"
                >
                  <History size={18} className="text-purple-500 dark:text-purple-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Past Reflections
                  </span>
                </button>

                <AnimatePresence>
                  {showReflections && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-2 max-h-64 overflow-y-auto"
                    >
                      {loading ? (
                        <div className="p-4 text-center text-slate-500">Loading reflections...</div>
                      ) : reflections.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">No reflections yet</div>
                      ) : (
                        reflections.map((reflection) => (
                          <div key={reflection.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-500">
                                  {new Date(reflection.created_at || reflection.date).toLocaleDateString()}
                                </span>
                              </div>
                              <button
                                onClick={() => deleteReflection(reflection.id)}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              <p><strong>Values:</strong> {(reflection.core_values || []).join(', ') || 'None'}</p>
                              <p><strong>Goals:</strong> {(reflection.life_goals || []).join(', ') || 'None'}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

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