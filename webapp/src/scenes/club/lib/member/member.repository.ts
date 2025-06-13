import supabase from "@/utils/supabase";
import { TablesInsert } from "shared/types/supabase";
import { Member } from "../club/club.service";

export const memberService = {
  create: async (payload: TablesInsert<"club_member">) => {
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
  },

  getById: async (memberId: number) => {
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
  },

  getByClubId: async (clubId: number) => {
    const { data } = await supabase
      .from("club_member")
      .select("*, profile: users(*)")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .throwOnError();
    if (!data) return [];
    return data;
  },

  update: async (memberId: number, payload: Partial<Member>) => {
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
  },

  delete: async (clubId: number, userId: string) => {
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
  },
};
