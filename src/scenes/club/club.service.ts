import supabase from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { Tables } from "types/supabase";

export type Club = Tables<"clubs"> & {
  members: Tables<"club_enrolments">[] | null;
};

export type Game = Tables<"games"> & {
  players: Tables<"game_registrations">[];
};

export type Member = Tables<"club_enrolments"> & {
  profile: Tables<"users"> | null;
};

export function isMember(user: User, club: Club) {
  return club.members.map((m) => m.user_id).includes(user.id);
}

export function isAdmin(user: User, club: Club) {
  return club.members
    .filter((m) => m.role === "admin")
    .map((m) => m.user_id)
    .includes(user.id);
}

export async function fetchClub(id: number) {
  const { data } = await supabase
    .from("clubs")
    .select("*, members: club_enrolments (*)")
    .eq("id", id)
    .single()
    .throwOnError();
  return data;
}

export async function fetchUpcomingGames(clubId: number) {
  const { data } = await supabase
    .from("games")
    .select("*, players:game_registrations(*)")
    .eq("club_id", clubId)
    .gte("date", new Date().toISOString())
    .order("date")
    .throwOnError();
  return data;
}

export async function fetchPastGames(clubId: number, year: string) {
  const { data } = await supabase
    .from("games")
    .select()
    .eq("club_id", clubId)
    .gte("date", new Date(parseInt(year), 0, 1).toISOString())
    .lte("date", new Date(parseInt(year), 11, 31).toISOString())
    .lte("date", new Date().toISOString())
    .order("date", { ascending: false })
    .throwOnError();
  return data;
}

async function fetchMember(clubId: number, userId: string) {
  const { data } = await supabase
    .from("club_enrolments")
    .select()
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .single()
    .throwOnError();
  return data;
}

export async function fetchMembers(clubId: number) {
  const { data } = await supabase
    .from("club_enrolments")
    .select("*, profile: users(*)")
    .eq("club_id", clubId)
    .throwOnError();
  return data;
}

export async function joinClub(clubId: number, userId: string) {
  const member = await fetchMember(clubId, userId);
  if (member) {
    throw new Error("Vous êtes déjà membre de ce club.");
  }
  const { data } = await supabase
    .from("club_enrolments")
    .insert({ club_id: clubId, user_id: userId })
    .select()
    .single()
    .throwOnError();
  return data;
}

export async function leaveClub(clubId: number, userId: string) {
  const member = await fetchMember(clubId, userId);
  if (!member) {
    throw new Error("Vous n'êtes pas membre de ce club.");
  }
  const { data } = await supabase
    .from("club_enrolments")
    .delete()
    .eq("club_id", clubId)
    .eq("user_id", userId)
    .select()
    .single()
    .throwOnError();
  return data;
}
