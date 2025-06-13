import { useMutation } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { Member, useClubCache } from "../club/club.service";
import { memberService } from "./member.repository";

export function useUpdateMember(member: Member) {
  const { updateMemberInCache } = useClubCache();
  const mutationFn = (payload: TablesUpdate<"club_member">) =>
    memberService.update(member.id, payload);
  return useMutation({ mutationFn, onSuccess: updateMemberInCache });
}
