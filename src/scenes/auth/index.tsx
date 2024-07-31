import supabase from "@/utils/supabase";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";

export default function Auth() {
  return (
    <div className="mx-auto max-w-lg p-4">
      <SupabaseAuth supabaseClient={supabase} providers={[]} />
    </div>
  );
}
