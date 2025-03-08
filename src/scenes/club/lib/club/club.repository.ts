import supabase from "@/utils/supabase";
import { Tables, TablesUpdate } from "types/supabase";

export async function getClub(id: number) {
  const { data } = await supabase
    .from("clubs")
    .select("*, members: club_member (*), seasons: season (*)")
    .eq("id", id)
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Club not found");
  }
  return data;
}

export async function updateClub(
  payload: TablesUpdate<"clubs">,
): Promise<Tables<"clubs">> {
  if (!payload.id) {
    throw new Error("No club id provided.");
  }
  const { data } = await supabase
    .from("clubs")
    .update(payload)
    .eq("id", payload.id)
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("No data found.");
  }
  return data;
}

export async function deleteClub(clubId: number) {
  const { data } = await supabase
    .from("clubs")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", clubId)
    .select()
    .single()
    .throwOnError();
  return data;
}
