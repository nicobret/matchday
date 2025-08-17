import { Tables } from "shared/types/supabase";
import supabase from "../../utils/supabase";

export async function fetchGameStats(game_id: number, sortby: string) {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("game_id", game_id)
    .order(sortby, { ascending: false })
    .throwOnError();
  return data || [];
}

export async function fetchClubStats(
  club_id: number,
): Promise<Tables<"game_report">[]> {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("club_id", club_id)
    .throwOnError();
  if (data === undefined || data === null) {
    throw new Error("No data found");
  }
  return data;
}

export async function getPlayerStatsByUserId(user_id: string) {
  const history = await fetchPlayerStats(user_id);
  const formattedData = aggregatePlayerStatsByClubId(history);
  return { history, formattedData };
}

export async function fetchPlayerStats(user_id: string) {
  const { data } = await supabase
    .from("game_report")
    .select()
    .eq("user_id", user_id)
    .order("game_date", { ascending: false })
    .throwOnError();
  return data || [];
}

type statsAggregatedByClubAndSeason = {
  clubId: number;
  statsBySeason: {
    season: string;
    goals: number;
    assists: number;
    saves: number;
  }[];
};

function aggregatePlayerStatsByClubId(
  stats: Tables<"game_report">[],
): statsAggregatedByClubAndSeason[] {
  // aggregate by club id and by season name
  const aggregated = stats.reduce(
    (acc, stat) => {
      const clubId = stat.club_id!;
      const clubName = stat.club_name || "Unknown Club";
      const seasonName = stat.season_name || "Unknown Season";
      if (!acc[clubId]) {
        acc[clubId] = {
          clubId,
          clubName,
          statsBySeason: [],
        };
      }
      const seasonStats = acc[clubId].statsBySeason.find(
        (s: { season: string }) => s.season === seasonName,
      );
      if (seasonStats) {
        seasonStats.goals += stat.goals;
        seasonStats.assists += stat.assists;
        seasonStats.saves += stat.saves;
      } else {
        acc[clubId].statsBySeason.push({
          season: seasonName,
          goals: stat.goals,
          assists: stat.assists,
          saves: stat.saves,
        });
      }
      return acc;
    },
    {} as Record<number, any>,
  );

  return Object.values(aggregated);
}
