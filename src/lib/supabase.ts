import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para TypeScript
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          role: 'user' | 'assistant'
          content: string
          mermaid_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: 'user' | 'assistant'
          content: string
          mermaid_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          role?: 'user' | 'assistant'
          content?: string
          mermaid_code?: string | null
          created_at?: string
        }
      }
      diagrams: {
        Row: {
          id: string
          chat_id: string
          message_id: string
          mermaid_code: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          message_id: string
          mermaid_code: string
          title: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          message_id?: string
          mermaid_code?: string
          title?: string
          created_at?: string
        }
      }
    }
  }
}

