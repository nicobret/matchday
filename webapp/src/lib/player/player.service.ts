import { queryClient } from "@/utils/react-query";
import supabase from "@/utils/supabase";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";
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
};

const selectQuery = "*, profile: users (*)";

export async function fetchPlayer(id: string) {
  const { data } = await supabase
    .from("game_player")
    .select(selectQuery)
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function fetchPlayers(game_id: number) {
  const { data } = await supabase
    .from("game_player")
    .select(selectQuery)
    .eq("game_id", game_id)
    .throwOnError();
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
    () => {
      console.log("Invalidating player list cache.");
      queryClient.invalidateQueries({ queryKey: ["players", gameId] });
    },
  );
}

// export function getPlayerChannel(gameId: number) {
//   return supabase
//     .channel("game_player")
//     .on(
//       REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
//       {
//         event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
//         schema: "public",
//         table: "game_player",
//         filter: `game_id=eq.${gameId}`,
//       },
//       (payload) => {
//         const data = payload.new as Tables<"game_player">;
//         queryClient.setQueryData(["players", gameId], (cache: Player[] = []) =>
//           cache.map((p) => (p.id === data.id ? { ...p, ...data } : p)),
//         );
//       },
//     )
//     .on(
//       REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
//       {
//         event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
//         schema: "public",
//         table: "game_player",
//         filter: `game_id=eq.${gameId}`,
//       },
//       async (payload) => {
//         const data = payload.new as Tables<"game_player">;
//         const cache = queryClient.getQueryData(["players", gameId]) as Player[];
//         if (cache?.some((p) => p.id === data.id)) return; // Player already exists in cache
//         // Fetch the populated player profile
//         const playerWithProfile = await fetchPlayer(data.id);
//         if (!playerWithProfile) throw new Error("Player not found");
//         queryClient.setQueryData(
//           ["players", gameId],
//           (currentCache: Player[] = []) => [...currentCache, playerWithProfile],
//         );
//       },
//     );
//   // Impossible to listen to DELETE events because of the filter.
// }
