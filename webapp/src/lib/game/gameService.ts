import supabase from "@/utils/supabase";
import { CalendarEvent } from "calendar-link";
import { addMinutes, differenceInCalendarDays, isPast } from "date-fns";
import { Tables, TablesInsert, TablesUpdate } from "shared/types/supabase";

// Types
export type Game = Tables<"games"> & {
  club?: Tables<"clubs"> | null;
  players?: Tables<"game_player">[];
  season?: Tables<"season"> | null;
};

const selectQuery =
  "*, club: clubs!games_club_id_fkey (*), players: game_player (*), season (*)";

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

export async function fetchGames({
  clubId,
  when,
  seasonId,
}: {
  clubId?: number;
  when?: "upcoming" | "past";
  seasonId?: string;
}) {
  const query = gamesQueryBuilder(clubId, when, seasonId);
  const { data } = await query.throwOnError();
  if (!data) return [];
  return data;
}

export async function getUpcomingGamesByUserId(
  userId: string,
): Promise<Game[]> {
  const { data } = await supabase
    .from("games")
    .select(
      `
      *,
      club: clubs!games_club_id_fkey (*),
      season (*),
      players: game_player (*),
      game_player!inner (user_id)
    `,
    )
    .eq("game_player.user_id", userId)
    .neq("status", "deleted")
    .gte("date", new Date().toISOString())
    .order("date")
    .throwOnError();

  const games = data.map(({ game_player, ...rest }) => rest);
  return games;
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
  when?: "upcoming" | "past" | "today",
  seasonId?: string,
) {
  let query = supabase
    .from("games")
    .select(selectQuery)
    .neq("status", "deleted");

  if (clubId) {
    query.eq("club_id", clubId);
  }
  if (when === "upcoming") {
    query.gte("date", new Date().toISOString());
    query.order("date");
  }
  if (when === "past") {
    query.lt("date", new Date().toISOString());
  }
  if (when === "today") {
    query.eq("date", new Date().toISOString().split("T")[0]);
  }
  if (seasonId === "none") {
    query.is("season_id", null);
  } else if (seasonId) {
    query.eq("season_id", seasonId);
  }

  return query;
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

export function getGameStatusString(game: Tables<"games">): string {
  if (game.status === "deleted") {
    return "Match supprimé";
  }

  const startDate = new Date(game.date);
  const durationInMinutes = getGameDurationInMinutes(game.duration as string);
  const endDate = addMinutes(startDate, durationInMinutes);

  if (isPast(endDate)) {
    if (game.score) {
      return `Match terminé • ${game.score[0]} - ${game.score[1]}`;
    } else {
      return "Match terminé";
    }
  }

  if (isPast(startDate)) {
    return "Match en cours";
  }

  const daysUntilGame = differenceInCalendarDays(startDate, new Date());

  if (daysUntilGame === 0) {
    return "Le match a lieu aujourd'hui.";
  }

  if (daysUntilGame === 1) {
    return "Le match a lieu demain.";
  }

  return `Le match a lieu dans ${daysUntilGame} jours.`;
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
