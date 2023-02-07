import { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

import { Database } from '../types/supabase'

export const supabase = createClient<Database>(
  process.env.REACT_APP_SB_URL!, 
  process.env.REACT_APP_SB_KEY!
)

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    supabase.auth.onAuthStateChange((_, session) => setSession(session))
  }, [])

  return session
}