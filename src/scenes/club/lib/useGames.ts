import { fetchGames } from "@/scenes/game/lib/game/game.service";
import { useQuery } from "react-query";

export default function useGames(
  clubId?: number,
  filter?: "all" | "next" | "past",
  seasonId?: string,
) {
  return useQuery({
    queryKey: ["games", clubId, filter, seasonId],
    queryFn: async () => await fetchGames(clubId, filter, seasonId),
  });
}