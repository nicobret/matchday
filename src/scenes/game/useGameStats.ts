import { fetchGameStats } from "@/stats.service";
import { useQuery } from "react-query";

export default function useGameStats({
  gameId,
  sortby,
}: {
  gameId: number;
  sortby: "goals" | "assists" | "saves";
}) {
  return useQuery({
    queryKey: ["game_stats", gameId, sortby],
    queryFn: () => fetchGameStats(gameId, sortby),
    enabled: !!gameId,
  });
}
