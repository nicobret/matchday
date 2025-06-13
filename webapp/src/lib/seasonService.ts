import supabase from "@/utils/supabase";
import { Tables, TablesInsert, TablesUpdate } from "shared/types/supabase";

export default {
  create: async (
    payload: TablesInsert<"season">,
  ): Promise<Tables<"season">> => {
    const { data } = await supabase
      .from("season")
      .insert(payload)
      .select()
      .single()
      .throwOnError();
    return data;
  },

  getByClubId: async (clubId: number): Promise<Tables<"season">[]> => {
    const { data } = await supabase
      .from("season")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .throwOnError();
    if (!data) throw new Error("No data found.");
    return data;
  },

  update: async (
    payload: TablesUpdate<"season">,
  ): Promise<Tables<"season">> => {
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
  },

  delete: async (seasonId: string) => {
    await supabase.from("season").delete().eq("id", seasonId).throwOnError();
  },
};
