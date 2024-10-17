import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import { Tables } from "types/supabase";

export type Player = Tables<"game_player"> & {
  profile: Tables<"users"> | null;
};

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
      queryClient.setQueryData(
        ["players", game_id],
        (oldPlayers?: Player[]) => {
          return [...(oldPlayers ?? []), data[0]];
        },
      );
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
    queryClient.setQueryData(["players", game_id], (oldPlayers?: Player[]) => {
      return (
        oldPlayers?.filter((oldPlayer) => oldPlayer.profile?.id !== user_id) ??
        []
      );
    });
  } catch (error) {
    console.error(error);
  }
}

function updateCachedTeams(player: Player) {
  queryClient.setQueryData(
    ["players", player.game_id],
    (oldPlayers?: Player[]) => {
      return (
        oldPlayers?.map((oldPlayer) =>
          oldPlayer.id === player.id ? player : oldPlayer,
        ) ?? []
      );
    },
  );
}

export async function updatePlayerTeam(player: Player, team: number | null) {
  try {
    // Optimistic update
    updateCachedTeams({ ...player, team });
    // call
    const { data } = await supabase
      .from("game_player")
      .update({ team })
      .eq("id", player.id)
      .select("*, profile: users (*)")
      .single()
      .throwOnError();
    if (data) {
      // update with real data
      updateCachedTeams(data);
    } else {
      // rollback
      updateCachedTeams(player);
    }
  } catch (error) {
    console.error(error);
  }
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
        (oldPlayers?: Player[]) => {
          return data ?? oldPlayers ?? ([] as Player[]);
        },
      );
    }
  } catch (error) {
    console.error(error);
  }
}
