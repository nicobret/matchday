import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useMutation } from "react-query";
import { deleteMemberFromCache } from "../club/club.service";
import { deleteMember } from "./member.repository";

export default function useDeleteMember(clubId: number) {
  const { session } = useContext(SessionContext);
  const mutationFn = () => {
    if (!session?.user) throw new Error("User is not logged in.");
    return deleteMember(clubId, session.user.id);
  };
  return useMutation({ mutationFn, onSuccess: deleteMemberFromCache });
}
