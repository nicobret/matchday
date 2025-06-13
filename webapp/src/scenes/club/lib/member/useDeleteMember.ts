import { SessionContext } from "@/components/auth-provider";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useClubCache } from "../club/club.service";
import { memberService } from "./member.repository";

export default function useDeleteMember(clubId: number) {
  const { session } = useContext(SessionContext);
  const { deleteMemberFromCache } = useClubCache();
  const mutationFn = () => {
    if (!session?.user) throw new Error("User is not logged in.");
    return memberService.delete(clubId, session.user.id);
  };
  return useMutation({ mutationFn, onSuccess: deleteMemberFromCache });
}
