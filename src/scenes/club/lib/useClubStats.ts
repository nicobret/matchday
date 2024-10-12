import { fetchClubStats } from "@/lib/stats.service";
import { useQuery } from "react-query";

export default function useClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useQuery({
    queryKey: ["club_stats", clubId],
    queryFn: () => fetchClubStats(clubId),
    enabled: !!clubId,
  });
  if (!data) {
    return { data: [], isError, isLoading, isIdle };
  }

  const uniqueUserIds = Array.from(new Set(data.map((r) => r.user_id)));
  const formattedData = uniqueUserIds.map((userId) => {
    const userStats = data.filter((r) => r.user_id === userId);
    return {
      user_id: userId,
      firstname: userStats[0].firstname,
      lastname: userStats[0].lastname,
      goals: userStats.reduce((acc, row) => acc + (row.goals || 0), 0),
      assists: userStats.reduce((acc, row) => acc + (row.assists || 0), 0),
      saves: userStats.reduce((acc, row) => acc + (row.saves || 0), 0),
    };
  });

  return { data: formattedData, isError, isLoading, isIdle };
}
