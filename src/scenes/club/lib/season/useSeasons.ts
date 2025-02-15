import supabase from "@/utils/supabase";
import { useQuery } from "react-query";
import { Tables } from "types/supabase";

export default function useSeasons(clubId: number) {
  return useQuery({
    queryKey: ["seasons", clubId],
    queryFn: () => fetchSeasons(clubId),
    enabled: !!clubId,
  });
}

async function fetchSeasons(clubId: number): Promise<Tables<"season">[]> {
  const { data } = await supabase
    .from("season")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .throwOnError();
  if (!data) throw new Error("No data found.");
  return data;
}
