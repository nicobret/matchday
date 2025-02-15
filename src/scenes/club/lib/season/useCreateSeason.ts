import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import { useMutation } from "react-query";
import { Tables } from "types/supabase";

async function createSeason(
  clubId: number,
  name: string,
): Promise<Tables<"season">> {
  const { data, error } = await supabase
    .from("season")
    .insert({ club_id: clubId, name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export default function useCreateSeason(clubId: number) {
  return useMutation({
    mutationFn: (name: string) => createSeason(clubId, name),
    onSettled: () => queryClient.invalidateQueries(["seasons", clubId]),
  });
}
