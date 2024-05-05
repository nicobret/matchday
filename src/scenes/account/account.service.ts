import supabase from "@/utils/supabase";

export async function fetchProfile(id: string) {
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function updateProfile(
  id: string,
  firstname: string,
  lastname: string,
) {
  const { data } = await supabase
    .from("users")
    .update({ firstname, lastname })
    .eq("id", id)
    .select()
    .single()
    .throwOnError();
  return data;
}
