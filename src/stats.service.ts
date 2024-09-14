import supabase from "./utils/supabase";

export async function fetchGameStats(game_id: number, sortby: string) {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("game_id", game_id)
    .order(sortby, { ascending: false })
    .throwOnError();
  return data || [];
}

export async function fetchClubStats(club_id: number) {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("club_id", club_id)
    .throwOnError();
  return data || [];
}

export async function fetchPlayerStats(user_id: number) {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("user_id", user_id)
    .throwOnError();
  return data || [];
}
