import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { updateGame } from "./game.service";

export default function useUpdateGame(gameId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TablesUpdate<"games">) => updateGame(gameId, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["game", gameId], data);
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
