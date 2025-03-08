import { useMutation } from "@tanstack/react-query";
import { TablesUpdate } from "types/supabase";
import { Member, updateMemberInCache } from "../club/club.service";
import { updateMember } from "./member.repository";

export function useUpdateMember(member: Member) {
  const mutationFn = (payload: TablesUpdate<"club_member">) =>
    updateMember(member.id, payload);
  return useMutation({ mutationFn, onSuccess: updateMemberInCache });
}
