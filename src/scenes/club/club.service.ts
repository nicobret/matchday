import supabase from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { Tables } from "types/supabase";

export type Club = Tables<"clubs"> & {
  members?: Tables<"club_member">[];
  seasons?: Tables<"season">[];
};

export type Game = Tables<"games"> & {
  players: Tables<"game_player">[];
  season: Tables<"season"> | null;
};

export type Member = Tables<"club_member"> & {
  profile: Tables<"users"> | null;
};

export function isMember(user: User, club: Club) {
  if (!club.members) return false;
  return club.members.map((m) => m.user_id).includes(user.id);
}

export function isAdmin(user: User, club: Club) {
  if (!club.members) return false;
  return club.members
    .filter((m) => m.role === "admin")
    .map((m) => m.user_id)
    .includes(user.id);
}

export async function fetchClub(id: number) {
  const { data } = await supabase
    .from("clubs")
    .select("*, members: club_member (*), seasons: season (*)")
    .eq("id", id)
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Club not found");
  }
  return data;
}

export async function updateClub(formData: any, id: string) {
  const { data } = await supabase
    .from("clubs")
    .update({
      name: formData.name,
      description: formData.description,
      address: formData.address,
      postcode: formData.postcode,
      city: formData.city,
      country: formData.country,
    })
    .eq("id", parseInt(id))
    .select("*")
    .single()
    .throwOnError();
  if (data) return data;
}

export async function deleteClub(club: Club) {
  const { data } = await supabase
    .from("clubs")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", club.id)
    .select()
    .single()
    .throwOnError();
  return data;
}

export async function fetchUpcomingGames(clubId: number) {
  const { data } = await supabase
    .from("games")
    .select("*, players:game_player(*)")
    .eq("club_id", clubId)
    .gte("date", new Date().toISOString())
    .order("date")
    .throwOnError();
  if (!data) return [];
  return data;
}

export async function fetchPastGames(clubId: number, season_id: string) {
  let query = supabase
    .from("games")
    .select()
    .eq("club_id", clubId)
    .lte("date", new Date().toISOString())
    .order("date", { ascending: false });

  if (season_id === "none") {
    query = query.is("season_id", null);
  } else {
    query = query.eq("season_id", season_id);
  }

  const { data } = await query.throwOnError();
  if (!data) return [];
  return data;
}

async function fetchMember(clubId: number, userId: string) {
  const { data } = await supabase
    .from("club_member")
    .select()
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .single()
    .throwOnError();
  return data;
}

export async function fetchMembers(clubId: number) {
  const { data } = await supabase
    .from("club_member")
    .select("*, profile: users(*)")
    .eq("club_id", clubId)
    .throwOnError();
  if (!data) return [];
  return data;
}

export async function joinClub(clubId: number, userId: string) {
  const { data } = await supabase
    .from("club_member")
    .insert({ club_id: clubId, user_id: userId })
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de rejoindre ce club.");
  }
  return data;
}

export async function leaveClub(clubId: number, userId: string) {
  const member = await fetchMember(clubId, userId);
  if (!member) {
    throw new Error("Vous n'êtes pas membre de ce club.");
  }
  const { data } = await supabase
    .from("club_member")
    .delete()
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .select()
    .single()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de quitter ce club.");
  }
  return data;
}
