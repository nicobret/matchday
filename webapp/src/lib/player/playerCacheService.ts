import { QueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { Player } from "./player.service";

export function updatePlayerListCache(
  client: QueryClient,
  payload: TablesUpdate<"game_player">,
) {
  client.setQueryData(["players", payload.game_id], (cache: Player[] = []) => {
    return cache.map((player) =>
      player.id === payload.id ? { ...player, ...payload } : player,
    );
  });
}
