import { Session } from "@supabase/supabase-js";
import { useQuery } from "react-query";
import { fetchProfile } from "../account/account.service";

export default function useProfile({ session }: { session: Session | null }) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!session,
  });
}
