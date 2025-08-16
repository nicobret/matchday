import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { updateGame } from "./gameService";

export default function useUpdateGame(gameId: number) {
  const { toast } = useToast();
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
      toast({
        title: "Erreur",
        description: e.message,
        variant: "destructive",
      });
      console.error(e);
    },
  });
}
