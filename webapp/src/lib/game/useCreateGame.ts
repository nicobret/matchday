import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesInsert } from "shared/types/supabase";
import { toast } from "sonner";
import { createGame } from "./gameService";

export default function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TablesInsert<"games">) => createGame(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      toast.success("Match créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
