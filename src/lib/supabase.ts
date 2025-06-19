import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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