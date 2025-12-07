import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { toast } from "sonner";
import { updateGame } from "./gameService";

export default function useUpdateGame(gameId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TablesUpdate<"games">) => updateGame(gameId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["game", gameId], data);
      if (data.status === "deleted") {
        queryClient.invalidateQueries({ queryKey: ["games", data.club_id] });
      }
    },
    onError: (e: Error) => {
      toast.error(e.message);
      console.error(e);
    },
  });
}
