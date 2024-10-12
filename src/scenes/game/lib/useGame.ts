import { useQuery } from "react-query";
import { fetchGame } from "./game.service";

export default function useGame(id: number) {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id),
    enabled: !!id,
  });
}
