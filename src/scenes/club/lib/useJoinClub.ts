import { SessionContext } from "@/components/auth-provider";
import { queryClient } from "@/lib/react-query";
import { useContext } from "react";
import { useMutation } from "react-query";
import { joinClub } from "./club.service";

export default function useJoinClub(clubId: number) {
  const { session } = useContext(SessionContext);

  return useMutation({
    mutationFn: async () => {
      const res = await joinClub(clubId, session!.user.id);
      return res;
    },
    onSuccess: () => queryClient.invalidateQueries(["club", clubId]),
  });
}
