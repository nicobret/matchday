import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesInsert } from "shared/types/supabase";
import { createGame } from "./gameService";

export default function useCreateGame() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TablesInsert<"games">) => createGame(payload),
    onSuccess: ({ club_id }) => {
      queryClient.invalidateQueries({ queryKey: ["games", club_id] });
      toast({
        description: "Match créé",
      });
    },
    onError: (e: Error) => {
      toast({
        description: e.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    },
  });
}
