import supabase from "@/utils/supabase";
import { Tables } from "types/supabase";

export type Player = Tables<"game_registrations"> & {
  profile: Tables<"users"> | null;
};

export type Game = Tables<"games"> & {
  club:
    | (Tables<"clubs"> & {
        members: Tables<"club_enrolments">[];
      })
    | null;
  players?: Tables<"game_registrations">[];
};

export async function fetchGame(id: number) {
  const { data } = await supabase
    .from("games")
    .select(
      `
        *,
        club: clubs!games_club_id_fkey (*, members: club_enrolments (*)),
        players: game_registrations (*)
      `,
    )
    .eq("id", id)
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Game not found");
  }
  if (!data.club) {
    throw new Error("Club not found");
  }
  return data;
}

export async function fetchPlayers(game_id: number) {
  const { data } = await supabase
    .from("game_registrations")
    .select("*, profile: users (*)")
    .eq("game_id", game_id)
    .throwOnError();
  if (!data) {
    throw new Error("Players not found");
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
  const { data } = await supabase
    .from("games")
    .insert(game)
    .select()
    .single()
    .throwOnError();
  return data;
}

export function getGameDurationInMinutes(duration: string) {
  const [hours, minutes] = duration.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
}

export const categories = [
  { value: "futsal", label: "Futsal" },
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "handball", label: "Handball" },
  { value: "volleyball", label: "Volleyball" },
  { value: "rugby", label: "Rugby" },
  { value: "party", label: "Troisième mi-temps" },
];
