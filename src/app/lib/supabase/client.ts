import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/app/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _supabase: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (_supabase) return _supabase;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase env vars not set");
  }
  _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});