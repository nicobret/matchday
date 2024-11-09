import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { Tables } from "types/supabase";
import { Member, updateMember } from "./club.service";

type updateMemberPayload = Partial<
  Omit<Tables<"club_member">, "id" | "club_id" | "user_id">
>;

function updateMemberCache(clubId: number, data: Tables<"club_member">) {
  queryClient.setQueryData(["members", clubId], (oldData?: Member[]) =>
    oldData
      ? oldData.map((m) => (m.id === data.id ? { ...m, ...data } : m))
      : [],
  );
}

export function useUpdateMember(member: Member) {
  return useMutation({
    mutationFn: async (data: updateMemberPayload) =>
      await updateMember(member.id, data),
    onSuccess: (data) => updateMemberCache(member.club_id, data),
  });
}
