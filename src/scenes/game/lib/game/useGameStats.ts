import { fetchGameStats } from "@/lib/stats.service";
import { useQuery } from "@tanstack/react-query";

export default function useGameStats({
  gameId,
  sortby,
}: {
  gameId: number;
  sortby: "goals" | "assists" | "saves";
}) {
  return useQuery({
    queryKey: ["game_stats", gameId, sortby],
    queryFn: async () => await fetchGameStats(gameId, sortby),
    enabled: !!gameId,
  });
}
