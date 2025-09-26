import { createSeason } from "@/lib/season/seasonService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCreateSeason(clubId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createSeason({ club_id: clubId, name }),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("La saison a été créée.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["seasons", clubId] }),
  });
}
