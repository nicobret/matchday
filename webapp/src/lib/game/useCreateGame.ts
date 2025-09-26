import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesInsert } from "shared/types/supabase";
import { toast } from "sonner";
import { createGame } from "./gameService";

export default function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TablesInsert<"games">) => createGame(payload),
    onSuccess: ({ club_id }) => {
      queryClient.invalidateQueries({ queryKey: ["games", club_id] });
      toast.success("Match créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
