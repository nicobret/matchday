import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useQuery } from "react-query";
import { fetchMembers, Member } from "../club/club.service";

function isMember(members: Member[], userId: string) {
  return members.some((m) => m.user_id === userId) || false;
}

export function useMembers(clubId?: number) {
  const { session } = useContext(SessionContext);
  const res = useQuery({
    queryKey: ["members", clubId],
    queryFn: () => fetchMembers(clubId!),
    enabled: !!clubId,
  });
  return {
    ...res,
    isMember:
      res.data && session?.user.id
        ? isMember(res.data, session?.user.id)
        : false,
  };
}
