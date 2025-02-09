import { useMutation } from "react-query";
import { Tables } from "types/supabase";
import {
  Member,
  updateMember,
  updateMemberInCache,
} from "../club/club.service";

type updateMemberPayload = Partial<
  Omit<Tables<"club_member">, "id" | "club_id" | "user_id">
>;

export function useUpdateMember(member: Member) {
  return useMutation({
    mutationFn: async (data: updateMemberPayload) =>
      await updateMember(member.id, data),
    onSuccess: (data) => updateMemberInCache(data),
  });
}
