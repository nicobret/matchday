import supabase from "@/utils/supabase";

export async function fetchPlayer(id: string) {
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}
