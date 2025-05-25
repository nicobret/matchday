import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

async function getClubs() {
  const { data } = await supabase
    .from("clubs")
    .select("*, members: club_member (*)")
    .is("deleted_at", null)
    .order("created_at")
    .throwOnError();
  if (!data) return [];
  return data;
}

export default function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: getClubs,
  });
}
