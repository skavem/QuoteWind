import { Database } from "./supabase"

export type StateRow = Database['public']['Tables']['State']['Row']
export type DBTables = Database['public']['Tables']