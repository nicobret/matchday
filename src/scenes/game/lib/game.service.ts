import supabase from "@/utils/supabase";
import { CalendarEvent } from "calendar-link";
import { Tables } from "types/supabase";

export type Game = Tables<"games"> & {
  club:
    | (Tables<"clubs"> & {
        members: Tables<"club_member">[];
      })
    | null;
  players?: Tables<"game_player">[];
  season?: Tables<"season"> | null;
};

export async function fetchGame(id: number) {
  const { error, data } = await supabase
    .from("games")
    .select(
      `
        *,
        club: clubs!games_club_id_fkey (*, members: club_member (*)),
        players: game_player (*),
        season: season (*)
      `,
    )
    .eq("id", id)
    .single()
    .throwOnError();
  if (error) {
    throw new Error(error.message);
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

export async function updateGame(
  newData: Partial<
    Omit<Tables<"games">, "id" | "club_id" | "created_at" | "edited_at">
  >,
  gameId: number,
) {
  const { data } = await supabase
    .from("games")
    .update(newData)
    .eq("id", Number(gameId))
    .select(
      `
      *,
      club: clubs!games_club_id_fkey (*, members: club_member (*)),
      players: game_player (*),
      season: season (*)
    `,
    )
    .single()
    .throwOnError();
  return data;
}

export function getCalendarEvent(g: Game): CalendarEvent {
  const durationInMinutes = getGameDurationInMinutes(String(g.duration));
  return {
    title: `${g.club?.name} - Match du ${new Date(g.date).toLocaleDateString(
      "fr-FR",
      {
        dateStyle: "long",
      },
    )}`,
    description: `Match de ${g.category} organisé par ${g.club?.name}`,
    start: new Date(g.date),
    duration: [durationInMinutes, "minutes"],
    location:
      g.location || `${g.club?.address}, ${g.club?.city} ${g.club?.postcode}`,
  };
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
