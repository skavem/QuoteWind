export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Book: {
        Row: {
          full_name: string
          id: number
          index: number
          name: string
        }
        Insert: {
          full_name: string
          id?: never
          index: number
          name: string
        }
        Update: {
          full_name?: string
          id?: never
          index?: number
          name?: string
        }
      }
      Chapter: {
        Row: {
          book_id: number
          id: number
          index: number
        }
        Insert: {
          book_id: number
          id?: never
          index: number
        }
        Update: {
          book_id?: number
          id?: never
          index?: number
        }
      }
      Couplet: {
        Row: {
          id: number
          index: number
          label: string | null
          song_id: number
          text: string | null
        }
        Insert: {
          id?: never
          index: number
          label?: string | null
          song_id: number
          text?: string | null
        }
        Update: {
          id?: never
          index?: number
          label?: string | null
          song_id?: number
          text?: string | null
        }
      }
      Song: {
        Row: {
          id: number
          label: string
          name: string
        }
        Insert: {
          id?: never
          label: string
          name: string
        }
        Update: {
          id?: never
          label?: string
          name?: string
        }
      }
      State: {
        Row: {
          couplet_id: number | null
          id: number
          styles: Json | null
          verse_id: number | null
        }
        Insert: {
          couplet_id?: number | null
          id?: never
          styles?: Json | null
          verse_id?: number | null
        }
        Update: {
          couplet_id?: number | null
          id?: never
          styles?: Json | null
          verse_id?: number | null
        }
      }
      Verse: {
        Row: {
          chapter_id: number
          id: number
          index: number
          text: string
        }
        Insert: {
          chapter_id: number
          id?: never
          index: number
          text: string
        }
        Update: {
          chapter_id?: number
          id?: never
          index?: number
          text?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type StateRow = Database['public']['Tables']['State']['Row']
export type DBTables = Database['public']['Tables']