import { SessionContext } from "@/components/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
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
  const myPlayer = res.data?.find((p) => p.user_id === session?.user.id);
  const count = res.data?.filter((e) => e.status === "confirmed").length || 0;
  return { ...res, isPlayer, count, myPlayer };
}
