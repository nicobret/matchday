import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { Player, updatePlayer } from "./player.service";

type Payload = TablesUpdate<"game_player">;

export default function useUpdatePlayer(player: Player) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (payload: Payload) => updatePlayer(player.id, payload),

    onMutate: (payload: Payload) => {
      client.setQueryData(["players", player.game_id], (cache: Player[] = []) =>
        cache.map((p) => (p.id === player.id ? { ...p, ...payload } : p)),
      );
      client.invalidateQueries({ queryKey: ["myGames"] });
    },

    onError: (_error, variables) =>
      client.invalidateQueries({ queryKey: ["players", variables.game_id] }),
  });
}
