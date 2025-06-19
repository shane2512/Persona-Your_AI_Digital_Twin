import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import axios from 'axios'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI reflection assistant. I can help you explore your thoughts, discuss your reflections, and provide guidance based on your personal journey. What would you like to talk about?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userReflections, setUserReflections] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      fetchUserReflections()
    } else if (isOpen && !user) {
      // For non-authenticated users, load from localStorage
      const savedReflections = JSON.parse(localStorage.getItem('personaMirrorReflections') || '[]')
      setUserReflections(savedReflections.slice(0, 3)) // Limit to recent 3
    }
  }, [isOpen, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchUserReflections = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setUserReflections(data || [])
    } catch (error) {
      console.error('Error fetching reflections:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const generateContextualPrompt = (userMessage: string) => {
    const hasReflections = userReflections.length > 0
    
    if (hasReflections) {
      const reflectionContext = userReflections.map(r => {
        // Handle both Supabase format and localStorage format
        const coreValues = r.core_values || r.userData?.coreValues || []
        const lifeGoals = r.life_goals || r.userData?.lifeGoals || []
        const struggles = r.current_struggles || r.userData?.currentStruggles || []
        const idealSelf = r.ideal_self || r.userData?.idealSelf || ''
        const decision = r.current_decision || r.userData?.currentDecision || ''
        
        return `
        - Core Values: ${Array.isArray(coreValues) ? coreValues.join(', ') : 'None'}
        - Life Goals: ${Array.isArray(lifeGoals) ? lifeGoals.join(', ') : 'None'}
        - Current Struggles: ${Array.isArray(struggles) ? struggles.join(', ') : 'None'}
        - Ideal Self: ${idealSelf || 'Not specified'}
        - Recent Decision: ${decision || 'None'}
        `
      }).join('\n')

      return `Based on the user's recent reflections:
        ${reflectionContext}
        
        User's question: ${userMessage}
        
        Please provide a thoughtful, personalized response that:
        1. Acknowledges their personal context and reflections
        2. Offers practical, actionable advice
        3. Encourages self-reflection and growth
        4. Maintains a supportive, empathetic tone
        5. Keeps the response concise (under 200 words)
        
        If the user is asking about something unrelated to personal development, gently guide them back to reflection and self-improvement topics.`
    } else {
      return `User's question: ${userMessage}
        
        This user hasn't completed any reflections yet. Please provide a thoughtful response focused on personal development, self-reflection, and growth. Encourage them to explore their values, goals, and personal journey. Keep it concise (under 200 words) and welcoming.`
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const prompt = generateContextualPrompt(userMessage.content)
      
      const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const apiUrl = isDev 
        ? '/api/get-advice'
        : '/.netlify/functions/get-advice'

      const response = await axios.post(apiUrl, {
        coreValues: [],
        lifeGoals: [],
        currentStruggles: [],
        idealSelf: prompt,
        currentDecision: ''
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.advice || "I'm here to help you reflect and grow. Could you tell me more about what's on your mind?",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm having trouble connecting right now, but I'm here to listen. What's been on your mind lately? Sometimes just talking through our thoughts can provide clarity.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md h-[600px] bg-white dark:bg-surface-800 rounded-2xl shadow-2xl border border-calm-100 dark:border-calm-400/30 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-calm-500 to-calm-400 dark:from-calm-600 dark:to-calm-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Reflection Assistant</h3>
                  <p className="text-xs opacity-90">
                    {user ? 'Personalized guidance based on your reflections' : 'Here to help you reflect and grow'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Context Banner for Non-Authenticated Users */}
            {!user && (
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  💡 Sign in to get personalized responses based on your reflections
                </p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-calm-100 dark:bg-calm-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-calm-600 dark:text-calm-400" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-calm-500 text-white rounded-br-md'
                        : 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.type === 'user' ? 'text-white' : 'text-surface-500 dark:text-surface-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-calm-500 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-calm-100 dark:bg-calm-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-calm-600 dark:text-calm-400" />
                  </div>
                  <div className="bg-surface-100 dark:bg-surface-700 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-calm-500" />
                      <span className="text-sm text-surface-600 dark:text-surface-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your reflections..."
                  className="flex-1 px-4 py-2 bg-surface-100 dark:bg-surface-700 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-calm-500/30 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-calm-500 hover:bg-calm-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChatBot