import { SessionContext } from "@/components/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Member } from "../club/club.service";
import { getMembersByClubId } from "./member.repository";

function isMember(members: Member[], userId: string) {
  return members.some((m) => m.user_id === userId) || false;
}

export function useMembers(clubId?: number) {
  const { session } = useContext(SessionContext);
  const res = useQuery({
    queryKey: ["members", clubId],
    queryFn: () => getMembersByClubId(clubId!),
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
