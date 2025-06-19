import { createClient } from '@supabase/supabase-js'

// Check if environment variables are properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Declare the supabase client variable
let supabase: any

// Validate environment variables and provide meaningful error handling
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error('Supabase environment variables are not configured properly. Please set up your .env file with valid Supabase credentials.')
  console.error('Required variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  
  // Create a mock client that will prevent the app from crashing
  // This allows the app to run without database functionality
  const mockClient = {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured')),
      insert: () => Promise.reject(new Error('Supabase not configured')),
      update: () => Promise.reject(new Error('Supabase not configured')),
      delete: () => Promise.reject(new Error('Supabase not configured')),
    }),
  }
  
  // Assign the mock client to the supabase variable
  supabase = mockClient
} else {
  // Create the actual Supabase client with valid credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Export the supabase client at the top level
export { supabase }

export type Database = {
  public: {
    Tables: {
      reflections: {
        Row: {
          id: string
          user_id: string | null
          core_values: string[]
          life_goals: string[]
          current_struggles: string[]
          ideal_self: string
          current_decision: string
          ai_advice: string
          mood: string | null
          quote_text: string | null
          quote_author: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          core_values?: string[]
          life_goals?: string[]
          current_struggles?: string[]
          ideal_self?: string
          current_decision?: string
          ai_advice?: string
          mood?: string | null
          quote_text?: string | null
          quote_author?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          core_values?: string[]
          life_goals?: string[]
          current_struggles?: string[]
          ideal_self?: string
          current_decision?: string
          ai_advice?: string
          mood?: string | null
          quote_text?: string | null
          quote_author?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}