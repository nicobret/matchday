import { createClient } from "@supabase/supabase-js";
import type { Database } from "shared/types/supabase";
import { env } from "../config/env";

const supabaseKey = env.VITE_SUPABASE_KEY || "";
const supabaseUrl = env.VITE_SUPABASE_URL || "";
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
