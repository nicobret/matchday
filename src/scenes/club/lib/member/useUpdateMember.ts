import { useMutation } from "react-query";
import { TablesUpdate } from "types/supabase";
import {
  Member,
  updateMember,
  updateMemberInCache,
} from "../club/club.service";

export function useUpdateMember(member: Member) {
  const mutationFn = (payload: TablesUpdate<"club_member">) =>
    updateMember(member.id, payload);
  return useMutation({ mutationFn, onSuccess: updateMemberInCache });
}
