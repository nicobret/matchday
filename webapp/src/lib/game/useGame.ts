import { useQuery } from "@tanstack/react-query";
import { fetchGame, getGameDurationInMinutes } from "./gameService";

export default function useGame(id: number) {
  const res = useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id),
    enabled: !!id,
  });
  const hasStarted = new Date(String(res.data?.date)) < new Date();
  const durationInMinutes = getGameDurationInMinutes(
    String(res.data?.duration),
  );
  const endDate = new Date(String(res.data?.date));
  endDate.setMinutes(endDate.getMinutes() + durationInMinutes);
  const hasEnded = endDate < new Date();
  return { ...res, hasStarted, hasEnded };
}
