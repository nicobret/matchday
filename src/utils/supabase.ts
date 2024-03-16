import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/supabase";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export default supabaseClient;
