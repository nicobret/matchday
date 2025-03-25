import supabase from "@/utils/supabase";
import { Tables } from "types/supabase";

async function fetchUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Vous n'êtes pas connecté.");
  }
  return user;
}

export async function getProfile(userId: string): Promise<Tables<"users">> {
  const { data } = await supabase
    .from("users")
    .select()
    .eq("id", userId)
    .single()
    .throwOnError();
  if (!data) throw new Error("Profil non trouvé");
  return data;
}

export async function updateProfile(firstname: string, lastname: string) {
  const user = await fetchUser();
  const { data } = await supabase
    .from("users")
    .update({ firstname, lastname })
    .eq("id", user.id)
    .select()
    .single()
    .throwOnError();
  if (!data) throw new Error("Profil non mis à jour");
  return data;
}
