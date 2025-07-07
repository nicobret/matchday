import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { updateClub } from "./club.repository";

export default function useUpdateClub(clubId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TablesUpdate<"clubs">) =>
      updateClub({ ...data, id: clubId }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      toast({ description: "Club modifié avec succès" });
    },

    onError: (error: Error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
}
