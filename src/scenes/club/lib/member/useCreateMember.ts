import { SessionContext } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useContext } from "react";
import { useMutation } from "react-query";
import { addMemberToCache, joinClub } from "../club/club.service";

export default function useCreateMember(clubId: number) {
  const { session } = useContext(SessionContext);
  const { toast } = useToast();
  const mutationFn = () => {
    if (!session?.user) throw new Error("user not authenticated");
    return joinClub(clubId, session.user.id);
  };
  const onError = (error: Error) => {
    toast({ description: error.message, variant: "destructive" });
  };
  return useMutation({ mutationFn, onSuccess: addMemberToCache, onError });
}
