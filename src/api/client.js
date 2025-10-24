import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client instance for the browser to avoid
// multiple GoTrueClient instances which trigger the warning.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function createBrowserClient() {
  return supabase;
}
