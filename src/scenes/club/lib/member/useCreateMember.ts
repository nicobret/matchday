import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useMutation } from "react-query";
import { addMemberToCache, joinClub } from "../club/club.service";

export default function useCreateMember(clubId: number) {
  const { session } = useContext(SessionContext);

  return useMutation({
    mutationFn: async () => {
      if (!session?.user) {
        throw new Error("Vous n'êtes pas connecté.");
      }
      return await joinClub(clubId, session?.user?.id);
    },
    onSettled: (data) => {
      if (data) addMemberToCache(data);
    },
  });
}
