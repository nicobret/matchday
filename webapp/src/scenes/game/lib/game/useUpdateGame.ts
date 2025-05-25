import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { updateGame } from "./game.service";

export default function useUpdateGame(gameId: number) {
  return useMutation({
    mutationFn: async (data: TablesUpdate<"games">) =>
      await updateGame(gameId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["game", data?.id], data);
    },
    onError: (e: Error) => {
      window.alert("Une erreur s'est produite.");
      console.error(e);
    },
  });
}
