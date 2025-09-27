import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/types";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
