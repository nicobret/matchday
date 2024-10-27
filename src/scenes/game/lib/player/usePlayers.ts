import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useQuery } from "react-query";
import { fetchPlayers } from "./player.service";

export default function usePlayers(gameId: number) {
  const { session } = useContext(SessionContext);
  const res = useQuery({
    queryKey: ["players", gameId],
    queryFn: () => fetchPlayers(Number(gameId)),
    enabled: !!gameId,
  });
  const isPlayer = res.data?.some(
    (p) => p.profile?.id === session?.user.id && p.status === "confirmed",
  );
  return { ...res, isPlayer };
}
