import supabaseClient from "@/utils/supabase";

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

export type gameSummary = {
  id: number;
  date: Date;
  location: string;
  status: "draft" | "published" | "canceled" | "finished";
  created_at: string;
  player_count: Array<{ count: number }>;
  score: Array<{ count: number }>;
  opponent: {
    id: string;
    name: string;
  };
};

export async function fetchGames() {
  const { data, error } = await supabaseClient.from("games").select(
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
  const { data, error } = await supabaseClient
    .from("games")
    .select(
      `
      id,
      created_at,
      status,
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
    .eq("id", id);
  if (error) {
    console.error(error);
    return;
  }
  return data[0] as unknown as gameType;
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
    console.error(error);
    return;
  }

  return data[0];
}

export function userIsInGame(user: any, game: gameType) {
  return game.players.map((m) => m.id).includes(user.id);
}
