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
      _prisma_migrations: {
        Row: {
          id: string
          checksum: string
          finished_at: string | null
          migration_name: string
          logs: string | null
          rolled_back_at: string | null
          started_at: string
          applied_steps_count: number
        }
        Insert: {
          id: string
          checksum: string
          finished_at?: string | null
          migration_name: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
        Update: {
          id?: string
          checksum?: string
          finished_at?: string | null
          migration_name?: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
      }
      Book: {
        Row: {
          full_name: string
          name: string
          index: number
          id: number
          divider_before: string | null
        }
        Insert: {
          full_name: string
          name: string
          index: number
          id?: number
          divider_before?: string | null
        }
        Update: {
          full_name?: string
          name?: string
          index?: number
          id?: number
          divider_before?: string | null
        }
      }
      Chapter: {
        Row: {
          book_id: number
          index: number
          id: number
        }
        Insert: {
          book_id: number
          index: number
          id?: number
        }
        Update: {
          book_id?: number
          index?: number
          id?: number
        }
      }
      Couplet: {
        Row: {
          song_id: number
          label: string | null
          text: string | null
          index: number
          id: number
          fts: unknown | null
        }
        Insert: {
          song_id: number
          label?: string | null
          text?: string | null
          index: number
          id?: number
          fts?: unknown | null
        }
        Update: {
          song_id?: number
          label?: string | null
          text?: string | null
          index?: number
          id?: number
          fts?: unknown | null
        }
      }
      Song: {
        Row: {
          name: string
          label: string
          id: number
          fts: unknown | null
        }
        Insert: {
          name: string
          label: string
          id?: number
          fts?: unknown | null
        }
        Update: {
          name?: string
          label?: string
          id?: number
          fts?: unknown | null
        }
      }
      State: {
        Row: {
          couplet_id: number | null
          verse_id: number | null
          styles: Json | null
          id: number
        }
        Insert: {
          couplet_id?: number | null
          verse_id?: number | null
          styles?: Json | null
          id?: number
        }
        Update: {
          couplet_id?: number | null
          verse_id?: number | null
          styles?: Json | null
          id?: number
        }
      }
      Verse: {
        Row: {
          chapter_id: number
          index: number
          text: string
          id: number
          fts: unknown | null
        }
        Insert: {
          chapter_id: number
          index: number
          text: string
          id?: number
          fts?: unknown | null
        }
        Update: {
          chapter_id?: number
          index?: number
          text?: string
          id?: number
          fts?: unknown | null
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

