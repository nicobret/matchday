import supabase from "@/utils/supabase";
import { Tables, TablesUpdate } from "types/supabase";

export async function createSeason(
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

export async function getSeasonsByClubId(
  clubId: number,
): Promise<Tables<"season">[]> {
  const { data } = await supabase
    .from("season")
    .select("*")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .throwOnError();
  if (!data) throw new Error("No data found.");
  return data;
}

export async function updateSeason(
  payload: TablesUpdate<"season">,
): Promise<Tables<"season">> {
  if (!payload.id) throw new Error("No season id provided.");
  const { data } = await supabase
    .from("season")
    .update({ name: payload.name })
    .eq("id", payload.id)
    .throwOnError();
  if (!data) throw new Error("No data found.");
  return data;
}

export async function deleteSeason(seasonId: string) {
  await supabase.from("season").delete().eq("id", seasonId).throwOnError();
}
