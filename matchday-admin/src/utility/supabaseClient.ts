import { createClient } from "@refinedev/supabase";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";

export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: "public",
  },
  auth: {
    persistSession: true,
  },
});
