import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { Player, updateCache, updatePlayer } from "./player.service";

type payloadType = Partial<Player> & { id: string };

export default function useUpdatePlayer(gameId: number) {
  return useMutation({
    mutationFn: async (payload: payloadType) =>
      await updatePlayer(payload.id, payload),
    onMutate: async (payload: payloadType) => {
      const backup = queryClient.getQueryData(["players", gameId]) as Player[];
      await updateCache({ ...payload, game_id: gameId });
      return { backup };
    },
    onError: (_error, data, context) => {
      if (context?.backup) {
        queryClient.setQueryData(["players", gameId], context.backup);
      } else {
        queryClient.invalidateQueries("players");
      }
    },
  });
}
