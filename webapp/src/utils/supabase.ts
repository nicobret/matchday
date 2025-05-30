import { createClient } from "@supabase/supabase-js";
import type { Database } from "shared/types/supabase";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
