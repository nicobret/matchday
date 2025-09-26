import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { toast } from "sonner";
import { updateClub } from "./club.repository";

export default function useUpdateClub(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TablesUpdate<"clubs">) =>
      updateClub({ ...data, id: clubId }),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["club", clubId] });
      toast.success("Club modifié avec succès");
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
