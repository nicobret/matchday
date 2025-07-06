import { useMutation } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { Member, useClubCache } from "../club/club.service";
import { updateMember } from "./member.repository";

export function useUpdateMember(member: Member) {
  const { updateMemberInCache } = useClubCache();
  const mutationFn = (payload: TablesUpdate<"club_member">) =>
    updateMember(member.id, payload);
  return useMutation({ mutationFn, onSuccess: updateMemberInCache });
}
