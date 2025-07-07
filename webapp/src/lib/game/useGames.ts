import { useQuery } from "@tanstack/react-query";
import { fetchGames } from "./gameService";

export default function useGames({
  clubId,
  filter,
  seasonId,
}: {
  clubId?: number;
  filter?: "all" | "next" | "past";
  seasonId?: string;
}) {
  return useQuery({
    queryKey: ["games", clubId, filter, seasonId],
    queryFn: async () => await fetchGames(clubId, filter, seasonId),
  });
}
