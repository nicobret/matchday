import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import { useMutation } from "react-query";
import { TablesInsert } from "types/supabase";

async function createSeason(
  clubId: number,
  name: string,
): Promise<TablesInsert<"season">> {
  const { data, error } = await supabase
    .from("season")
    .insert({ club_id: clubId, name });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Erreur inconnue");
  return data;
}

export default function useCreateSeason(clubId: number) {
  return useMutation({
    mutationFn: async (name: string) => await createSeason(clubId, name),
    onSettled: () => queryClient.invalidateQueries(["seasons", clubId]),
  });
}
