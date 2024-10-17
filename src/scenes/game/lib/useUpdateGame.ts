import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { updateGame, updateGamePayload } from "./game.service";

export default function useUpdateGame(gameId: number) {
  return useMutation({
    mutationFn: async (data: updateGamePayload) => {
      return await updateGame(gameId, data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["game", data?.id], data);
    },
    onError: (e: Error) => {
      window.alert("Une erreur s'est produite.");
      console.error(e);
    },
  });
}
