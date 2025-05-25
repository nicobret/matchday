import supabase from "@/utils/supabase";
import { TablesInsert } from "shared/types/supabase";
import { Member } from "../club/club.service";

export async function createMember(payload: TablesInsert<"club_member">) {
  const { data } = await supabase
    .from("club_member")
    .insert(payload)
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de rejoindre ce club.");
  }
  return data;
}

export async function getMemberById(memberId: number) {
  const { data } = await supabase
    .from("club_member")
    .select("*, profile: users(*)")
    .eq("id", memberId)
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Membre introuvable.");
  }
  return data;
}

export async function getMembers(clubId: number) {
  const { data } = await supabase
    .from("club_member")
    .select("*, profile: users(*)")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .throwOnError();
  if (!data) return [];
  return data;
}

export async function updateMember(memberId: number, payload: Partial<Member>) {
  const { data } = await supabase
    .from("club_member")
    .update(payload)
    .eq("id", memberId)
    .select()
    .maybeSingle()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de mettre à jour le membre.");
  }
  return data;
}

export async function deleteMember(clubId: number, userId: string) {
  const { data } = await supabase
    .from("club_member")
    .delete()
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de quitter ce club.");
  }
  return data;
}
