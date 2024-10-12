import supabase from "@/utils/supabase";
import { useQuery } from "react-query";

export default function useSeason(clubId: number) {
  return useQuery({
    queryKey: ["seasons", clubId],
    queryFn: () => fetchSeasons(clubId),
    enabled: !!clubId,
  });
}

async function fetchSeasons(clubId: number) {
  const { data } = await supabase
    .from("season")
    .select("*")
    .eq("club_id", clubId)
    .throwOnError();
  if (data) {
    return data;
  }
}
