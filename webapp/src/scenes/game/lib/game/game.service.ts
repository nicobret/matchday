import supabase from "@/utils/supabase";
import { CalendarEvent } from "calendar-link";
import { Tables, TablesInsert, TablesUpdate } from "shared/types/supabase";

// Types
export type Game = Tables<"games"> & {
  club?: Tables<"clubs"> | null;
  players?: Tables<"game_player">[];
  season?: Tables<"season"> | null;
};

const selectQuery =
  "*, club: clubs!games_club_id_fkey (*), players: game_player (*), season: season (*)";

// Repository
export async function fetchGame(id: number) {
  const { data } = await supabase
    .from("games")
    .select(selectQuery)
    .eq("id", id)
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Match non trouvé");
  }
  return data;
}

export async function fetchGames(
  clubId?: number,
  filter?: "all" | "next" | "past",
  seasonId?: string,
) {
  const query = gamesQueryBuilder(clubId, filter, seasonId);
  const { data } = await query.throwOnError();
  if (!data) return [];
  return data;
}

export async function createGame(payload: TablesInsert<"games">) {
  const { data } = await supabase
    .from("games")
    .insert(payload)
    .select(selectQuery)
    .single()
    .throwOnError();
  return data;
}

export async function updateGame(id: number, payload: TablesUpdate<"games">) {
  const { data } = await supabase
    .from("games")
    .update(payload)
    .eq("id", id)
    .select(selectQuery)
    .single()
    .throwOnError();
  return data;
}

// Utils
function gamesQueryBuilder(
  clubId?: number,
  filter?: "all" | "next" | "past",
  seasonId?: string,
) {
  let query = supabase.from("games").select(selectQuery);

  if (clubId) {
    query = query.eq("club_id", clubId);
  }
  if (filter === "next") {
    query = query
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true });
  }
  if (filter === "past") {
    query = query
      .lt("date", new Date().toISOString())
      .order("date", { ascending: false });
  }
  if (seasonId === "none") {
    query = query.is("season_id", null);
  } else if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  return query.neq("status", "deleted").order("date", { ascending: false });
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
