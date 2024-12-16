import { fetchClubStats } from "@/lib/stats.service";
import { useQuery } from "react-query";

export type ClubStatsType = {
  user_id: string | null;
  firstname: string | null;
  lastname: string | null;
  games: number;
  wins: number;
  winstreak: number;
  winrate: number;
  goals: number;
  assists: number;
  saves: number;
};

export default function useClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useQuery({
    queryKey: ["club_stats", clubId],
    queryFn: () => fetchClubStats(clubId),
    enabled: !!clubId,
  });
  if (!data) {
    return { data: [] as ClubStatsType[], isError, isLoading, isIdle };
  }

  const uniqueUserIds = Array.from(new Set(data.map((r) => r.user_id)));
  const formattedData: ClubStatsType[] = uniqueUserIds.map((userId) => {
    if (!userId) {
      throw new Error("User ID is missing");
    }
    const userRows = data.filter((r) => r.user_id === userId);
    return {
      user_id: userId,
      firstname: userRows[0].firstname,
      lastname: userRows[0].lastname,
      games: userRows.length,
      wins: userRows.filter((r) => r.result === "win").length,
      winstreak: userRows.reduce(
        (acc, row) => (row.result === "win" ? acc + 1 : 0),
        0,
      ),
      winrate:
        userRows.length > 0
          ? Math.round(
              (userRows.filter((r) => r.result === "win").length /
                userRows.length) *
                100,
            )
          : 0,
      goals: userRows.reduce((acc, row) => acc + (row.goals || 0), 0),
      assists: userRows.reduce((acc, row) => acc + (row.assists || 0), 0),
      saves: userRows.reduce((acc, row) => acc + (row.saves || 0), 0),
    };
  });

  return { data: formattedData, isError, isLoading, isIdle };
}
