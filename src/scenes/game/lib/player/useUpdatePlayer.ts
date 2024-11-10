import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { Player, updateCache, updatePlayer } from "./player.service";

type payloadType = Partial<Player>;

export default function useUpdatePlayer(player: Player) {
  return useMutation({
    mutationFn: async (payload: payloadType) =>
      await updatePlayer(player.id, payload),
    onMutate: async (payload: payloadType) => {
      const backup = queryClient.getQueryData([
        "players",
        player.game_id,
      ]) as Player[];
      await updateCache({ id: player.id, game_id: player.game_id, ...payload });
      return { backup };
    },
    onError: (_error, data, context) => {
      if (context?.backup) {
        queryClient.setQueryData(["players", player.game_id], context.backup);
      } else {
        queryClient.invalidateQueries("players");
      }
    },
  });
}
