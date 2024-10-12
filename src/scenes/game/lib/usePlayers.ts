import { useQuery } from "react-query";
import { fetchPlayers } from "./player.service";

export default function usePlayers(gameId: number) {
  return useQuery({
    queryKey: ["players", gameId],
    queryFn: () => fetchPlayers(Number(gameId)),
    enabled: !!gameId,
  });
}
