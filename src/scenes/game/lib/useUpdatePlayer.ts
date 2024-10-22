import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { Player, updateCache, updatePlayer } from "./player.service";

export default function useUpdatePlayer(playerId: string) {
  return useMutation({
    mutationFn: (payload: Partial<Player>) => updatePlayer(playerId, payload),
    onMutate: async (player: Partial<Player>) => {
      const backup = queryClient.getQueryData(["players", player.game_id]);
      await updateCache(player);
      return { backup };
    },
    onError: async (_error, _player, context) => {
      if (context?.backup) {
        await updateCache(context.backup);
      }
    },
  });
}
