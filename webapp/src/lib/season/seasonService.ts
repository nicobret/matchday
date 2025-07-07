import supabase from "@/utils/supabase";
import { Tables, TablesInsert, TablesUpdate } from "shared/types/supabase";

export async function createSeason(
  payload: TablesInsert<"season">,
): Promise<Tables<"season">> {
  const { data } = await supabase
    .from("season")
    .insert(payload)
    .select()
    .single()
    .throwOnError();
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
    .select()
    .single()
    .throwOnError();
  if (!data) throw new Error("No data found.");
  return data;
}

export async function deleteSeasonById(seasonId: string) {
  await supabase.from("season").delete().eq("id", seasonId).throwOnError();
}
