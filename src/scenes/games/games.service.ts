import supabaseClient from "@/utils/supabase";

export type match = {
  id: string;
  created_at: string;
  club_id: string;
  creator_id: string;
  date: Date;
  location: string;
};

export async function fetchGames() {
  const { data, error } = await supabaseClient.from("matches").select(
    `
      id,
      created_at,
      club_id,
      creator_id,
      date,
      location
    `
  );
  if (error) {
    console.log(error);
    return [];
  }
  return data;
}

export async function fetchGame(id: string) {
  const { data, error } = await supabaseClient
    .from("matches")
    .select(
      `
      id,
      created_at,
      club_id,
      creator_id,
      date,
      location
    `
    )
    .eq("id", id);
  if (error) {
    console.log(error);
    return [];
  }
  return data;
}

export async function createGame(game: {
  creator_id: string;
  club_id: string;
  date: string;
  location: string;
}) {
  const { data, error } = await supabaseClient
    .from("games")
    .insert(game)
    .select();

  if (error) {
    console.log(error);
    return;
  }

  return data[0];
}
