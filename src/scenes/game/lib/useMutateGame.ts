import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { Tables } from "types/supabase";
import { updateGame } from "./game.service";

export default function useMutateGame(gameId: number) {
  return useMutation({
    mutationFn: async (data: Partial<Tables<"games">>) => {
      return await updateGame(data, gameId);
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
