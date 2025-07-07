import supabase from "@/utils/supabase";
import { Tables, TablesUpdate } from "shared/types/supabase";

export async function getProfile(userId: string): Promise<Tables<"users">> {
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()
    .throwOnError();
  return data;
}

export async function updateProfile({
  userId,
  payload,
}: {
  userId: string;
  payload: TablesUpdate<"users">;
}): Promise<Tables<"users">> {
  const { data } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select()
    .single()
    .throwOnError();
  return data;
}
