import supabase from "@/utils/supabase";
import { Tables } from "types/supabase";

export type gameType = {
  id: number;
  created_at: string;
  status: "draft" | "published" | "canceled" | "finished";
  club_id: string;
  creator: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
  date: Date;
  score: Array<{ count: number }>;
  location: string;
  total_players: number;
  players: Array<{
    id: string;
    status: "accepted" | "pending" | "declined";
    created_at: Date;
    profile: {
      id: string;
      firstname: string;
      lastname: string;
      avatar: string;
      status: string;
    };
  }>;
};

export type gameSummary = Tables<"games"> & {
  game_registrations: Tables<"game_registrations">[];
};

export async function fetchGames() {
  const { data, error } = await supabase.from("games").select(
    `
      id,
      created_at,
      status,
      club_id,
      creator_id,
      date,
      location,
      player_count: game_registrations (count)
      score,
      opponent: game!opponent_id (id, name)
    `
  );
  if (error) {
    console.error(error);
    return [];
  }
  return data as unknown as gameType[];
}

export async function fetchGame(id: number) {
  const { data, error } = await supabase
    .from("games")
    .select(
      `
      id,
      created_at,
      status,
      score,
      club_id,
      creator: users (
        id,
        firstname,
        lastname,
        avatar,
        status
      ),
      date,
      location,
      total_players,
      players: game_registrations (
        id,
        status,
        created_at,
        profile: users (
          id,
          firstname,
          lastname,
          avatar,
          status
        )
      )
    `
    )
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return;
  }
  return data;
}

export async function createGame(game: {
  creator_id: string;
  club_id: number;
  date: string;
  total_players: number;
  location: string;
}) {
  const { data, error } = await supabase.from("games").insert(game).select();

  if (error) {
    console.error(error);
    return;
  }

  return data[0];
}

export function gameHasStarted(game: Tables<"games">) {
  if (!game.date) return false;
  return new Date(game.date) < new Date();
}
