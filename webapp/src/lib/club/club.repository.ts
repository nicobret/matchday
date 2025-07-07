import supabase from "@/utils/supabase";
import { Tables, TablesInsert, TablesUpdate } from "shared/types/supabase";

export async function createClub(
  payload: TablesInsert<"clubs">,
): Promise<Tables<"clubs">> {
  const { data } = await supabase
    .from("clubs")
    .insert(payload)
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de créer le club.");
  }
  return data;
}

export async function getClub(id: number): Promise<
  Tables<"clubs"> & {
    members: Tables<"club_member">[];
    seasons: Tables<"season">[];
  }
> {
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

export async function getClubs() {
  const { data } = await supabase
    .from("clubs")
    .select("*, members: club_member (*)")
    .is("deleted_at", null)
    .order("created_at")
    .throwOnError();
  if (!data) return [];
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
