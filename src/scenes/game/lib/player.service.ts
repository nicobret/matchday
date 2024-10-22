import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
} from "@supabase/supabase-js";
import { Tables } from "types/supabase";

const statusTranslation: { [key: string]: string } = {
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

export function translateStatus(status?: string) {
  if (!status) return "inconnu";
  return statusTranslation[status] || status;
}

export type Player = Tables<"game_player"> & {
  profile: Tables<"users"> | null;
};

const query = "*, profile: users (*)";

export async function fetchPlayer(id: string) {
  const { data } = await supabase
    .from("game_player")
    .select(query)
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function fetchPlayers(game_id: number) {
  const { data } = await supabase
    .from("game_player")
    .select(query)
    .eq("game_id", game_id)
    .throwOnError();
  return data;
}

export async function createPlayer(
  game_id: number,
  user_id?: string,
  name?: string,
) {
  if (!user_id && !name) {
    throw new Error("user_id or name is required");
  }
  const { data } = await supabase
    .from("game_player")
    .upsert(
      {
        game_id,
        user_id,
        name,
        status: "confirmed",
      },
      { onConflict: "game_id, user_id" },
    )
    .select()
    .single()
    .throwOnError();
  return data;
}

export async function updatePlayer(id: string, payload: Partial<Player>) {
  const { data } = await supabase
    .from("game_player")
    .update(payload)
    .eq("id", id)
    .select(query)
    .single()
    .throwOnError();
  if (data) {
    return data;
  }
}

export async function removePlayerFromGame(game_id: number, user_id: string) {
  try {
    const { data } = await supabase
      .from("game_player")
      .update({ status: "cancelled" })
      .eq("game_id", game_id)
      .eq("user_id", user_id)
      .select(query)
      .single()
      .throwOnError();
    if (data) {
      await updateCache(data);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function updatePlayerTeam(player: Player, team: number | null) {
  try {
    // Optimistic update
    updateCache({ ...player, team });
    const { data } = await supabase
      .from("game_player")
      .update({ team })
      .eq("id", player.id)
      .select(query)
      .single()
      .throwOnError();
    return data;
  } catch (e) {
    console.error(e);
    window.alert("Une erreur s'est produite.");
    // Rollback
    await updateCache(player);
  }
}

export async function updateCache(data: Partial<Player>) {
  const cacheData: Player[] =
    queryClient.getQueryData(["players", data.game_id]) ?? [];

  if (cacheData.some((p: Player) => p.id === data.id)) {
    queryClient.setQueryData(
      ["players", data.game_id],
      (cache?: Player[]) =>
        cache?.map((p) => (p.id === data.id ? { ...p, ...data } : p)) ?? [],
    );
  } else if (data.id) {
    const player = await fetchPlayer(data.id);
    if (!player) return;
    queryClient.setQueryData(["players", data.game_id], (cache?: Player[]) => [
      ...(cache || []),
      player,
    ]);
  }

  return queryClient.getQueryData(["players", data.game_id]) as Player[];
}

export function getPlayerChannel(gameId: number) {
  return supabase.channel("game_player").on(
    REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
    {
      event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL, // Does not listen to DELETE events because of the filter.
      schema: "public",
      table: "game_player",
      filter: `game_id=eq.${gameId}`,
    },
    async (payload) => {
      console.log("🚀 ~ payload:", payload);
      await updateCache(payload.new);
    },
  );
}
