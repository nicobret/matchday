import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useMutation } from "react-query";
import { Tables } from "types/supabase";
import { deleteMemberFromCache, leaveClub } from "../club/club.service";

export default function useDeleteMember(clubId: number) {
  const { session } = useContext(SessionContext);
  if (!session?.user) {
    throw new Error("User is not logged in.");
  }
  return useMutation({
    mutationFn: async () => await leaveClub(clubId, session?.user?.id),
    onSuccess: (data: Tables<"club_member">) => deleteMemberFromCache(data),
  });
}
