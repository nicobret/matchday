import { queryClient } from "@/utils/react-query";
import supabase from "@/utils/supabase";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";
import { QueryClient } from "@tanstack/react-query";
import { Tables, TablesUpdate } from "shared/types/supabase";

const statusTranslation: { [key: string]: string } = {
  confirmed: "Confirmé",
  cancelled: "Annulé",
  pending: "En attente",
};

export function translateStatus(status?: string) {
  if (!status) return "inconnu";
  return statusTranslation[status] || status;
}

export type Player = Tables<"game_player"> & {
  profile?: Tables<"users"> | null;
  game?: Tables<"games"> | null;
};

const selectQuery = "*, profile: users (*), game: games (*)";

export async function fetchPlayer(id: string) {
  const { data } = await supabase
    .from("game_player")
    .select(selectQuery)
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function fetchPlayers({
  game_id,
  user_id,
  status,
}: {
  game_id?: number;
  user_id?: string;
  status?: string;
}) {
  const query = supabase.from("game_player").select(selectQuery);
  if (game_id) {
    query.eq("game_id", game_id);
  }
  if (user_id) {
    query.eq("user_id", user_id);
  }
  if (status) {
    query.eq("status", status);
  }
  const { data } = await query.throwOnError();
  return data;
}

export async function createPlayer(
  game_id: number,
  user_id?: string,
  name?: string,
  status = "confirmed",
) {
  if (!user_id && !name) {
    throw new Error("user_id or name is required");
  }
  const { data } = await supabase
    .from("game_player")
    .upsert(
      { game_id, user_id, name, status },
      { onConflict: "game_id, user_id" },
    )
    .select()
    .single()
    .throwOnError();
  if (data) {
    return data;
  }
}

export async function updatePlayer(
  id: string,
  payload: TablesUpdate<"game_player">,
) {
  const { data } = await supabase
    .from("game_player")
    .update(payload)
    .eq("id", id)
    .select(selectQuery)
    .single()
    .throwOnError();
  if (data) {
    return data;
  }
}

export function getPlayerChannel(gameId: number) {
  return supabase.channel("player_list").on(
    REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
    {
      event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
      schema: "public",
      table: "game_player",
      filter: `game_id=eq.${gameId}`,
    },
    () => queryClient.invalidateQueries({ queryKey: ["players", gameId] }),
  );
}

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
