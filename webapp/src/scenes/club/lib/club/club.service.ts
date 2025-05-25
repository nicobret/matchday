import { queryClient } from "@/lib/react-query";
import { Tables } from "shared/types/supabase";

// Types

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

// Utils

export function getUsername(member: Member) {
  if (member.profile?.firstname && member.profile?.lastname) {
    return `${member.profile?.firstname} ${member.profile?.lastname}`;
  }
  if (member.profile?.firstname) {
    return member.profile?.firstname;
  }
  return "Utilisateur sans nom";
}

// Cache

export function addMemberToCache(payload: Tables<"club_member">) {
  queryClient.setQueryData(["members", payload.club_id], (cache?: Member[]) => {
    return cache
      ? [...cache, { ...payload, profile: null }]
      : [{ ...payload, profile: null }];
  });
}

export function updateMemberInCache(payload: Tables<"club_member">) {
  queryClient.setQueryData(["members", payload.club_id], (cache?: Member[]) => {
    return cache
      ? cache.map((m) => (m.id === payload.id ? { ...m, ...payload } : m))
      : [];
  });
}

export function deleteMemberFromCache(payload: Tables<"club_member">) {
  queryClient.setQueryData(["members", payload.club_id], (cache?: Member[]) => {
    return cache ? cache.filter((m) => m.id !== payload.id) : [];
  });
}
