import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";
import { Tables } from "types/supabase";

export type Player = Tables<"game_player"> & {
  profile: Tables<"users"> | null;
};

export async function fetchPlayer(id: string) {
  const { data } = await supabase
    .from("game_player")
    .select("*, profile: users (*)")
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function fetchPlayers(game_id: number) {
  const { data } = await supabase
    .from("game_player")
    .select("*, profile: users (*)")
    .eq("game_id", game_id)
    .throwOnError();
  return data;
}

export async function addPlayerToGame(game_id: number, user_id: string) {
  try {
    const { data } = await supabase
      .from("game_player")
      .insert({
        game_id,
        user_id,
        status: "confirmed",
      })
      .select("*, profile: users (*)")
      .throwOnError();
    if (data) {
      addCachedPlayer(data[0]);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function removePlayerFromGame(game_id: number, user_id: string) {
  try {
    await supabase
      .from("game_player")
      .delete()
      .eq("game_id", game_id)
      .eq("user_id", user_id)
      .select("*, profile: users (*)")
      .single()
      .throwOnError();
    deleteCachedPlayer({ game_id, profile: { id: user_id } } as Player);
  } catch (error) {
    console.error(error);
  }
}

export async function updatePlayerTeam(player: Player, team: number | null) {
  try {
    // Optimistic update
    updateCachedPlayer({ ...player, team });
    const { data } = await supabase
      .from("game_player")
      .update({ team })
      .eq("id", player.id)
      .select("*, profile: users (*)")
      .single()
      .throwOnError();
    return data;
  } catch (e) {
    console.error(e);
    window.alert("Une erreur s'est produite.");
    // Rollback
    updateCachedPlayer(player);
  }
}

export function addCachedPlayer(player: Player) {
  queryClient.setQueryData(["players", player.game_id], (cache?: Player[]) => {
    return [...(cache ?? []), player];
  });
}

export function updateCachedPlayer(player: Partial<Player>) {
  queryClient.setQueryData(["players", player.game_id], (cache?: Player[]) => {
    return (
      cache?.map((oldPlayer) =>
        oldPlayer.id === player.id ? { ...oldPlayer, ...player } : oldPlayer,
      ) ?? []
    );
  });
}

export function deleteCachedPlayer(player: Partial<Player>) {
  queryClient.setQueryData(["players", player.game_id], (cache?: Player[]) => {
    return cache?.filter((oldPlayer) => oldPlayer.id !== player.id) ?? [];
  });
}

export async function updatePlayerEvents(
  player: Player,
  events: Partial<Player>,
) {
  try {
    const { data } = await supabase
      .from("game_player")
      .update({
        goals: events.goals,
        assists: events.assists,
        saves: events.saves,
      })
      .eq("id", player.id)
      .select("*, profile: users (*)")
      .throwOnError();
    if (data) {
      queryClient.setQueryData(
        ["players", player.game_id],
        (cache?: Player[]) => {
          return data ?? cache ?? ([] as Player[]);
        },
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export function getPlayerChannel(gameId: number) {
  return supabase
    .channel("game_player")
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
        schema: "public",
        table: "game_player",
        filter: `game_id=eq.${gameId}`,
      },
      async (payload) => {
        try {
          const player = await fetchPlayer(payload.new.id);
          if (!player) return;
          addCachedPlayer(player);
        } catch (error) {
          console.error(error);
        }
      },
    )
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
        schema: "public",
        table: "game_player",
        filter: `game_id=eq.${gameId}`,
      },
      (payload) => updateCachedPlayer(payload.new),
    )
    .on(
      REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
      {
        event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
        schema: "public",
        table: "game_player",
      },
      (payload) => queryClient.invalidateQueries("players"),
    );
}
