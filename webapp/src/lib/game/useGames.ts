import { useQuery } from "@tanstack/react-query";
import { fetchGames } from "./gameService";

export default function useGames({
  clubId,
  when,
  seasonId,
}: {
  clubId?: number;
  when?: "upcoming" | "past";
  seasonId?: string;
}) {
  return useQuery({
    queryKey: ["games", clubId, when, seasonId],
    queryFn: () => fetchGames({ clubId, when, seasonId }),
  });
}
