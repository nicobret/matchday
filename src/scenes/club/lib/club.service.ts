import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
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

export async function updateClub(formData: any, id: number) {
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
    .eq("id", id)
    .select("*")
    .single()
    .throwOnError();
  if (data) {
    queryClient.setQueryData(["clubs", id], data);
  }
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

export async function updateMember(memberId: number, payload: Partial<Member>) {
  const { data } = await supabase
    .from("club_member")
    .update(payload)
    .eq("id", memberId)
    .select()
    .maybeSingle()
    .throwOnError();
  if (!data) {
    throw new Error("Impossible de mettre à jour le membre.");
  }
  return data;
}

export async function fetchMembers(clubId: number) {
  const { data } = await supabase
    .from("club_member")
    .select("*, profile: users(*)")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
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

export function getUsername(member: Member) {
  if (member.profile?.firstname && member.profile?.lastname) {
    return `${member.profile?.firstname} ${member.profile?.lastname}`;
  }
  if (member.profile?.firstname) {
    return member.profile?.firstname;
  }
  return "Utilisateur sans nom";
}
