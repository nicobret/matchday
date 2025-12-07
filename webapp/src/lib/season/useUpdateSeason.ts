import { updateSeason } from "@/lib/season/seasonService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useUpdateSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSeason,
    onSuccess: (data) => {
      toast.success("La saison a été modifiée.");
      queryClient.invalidateQueries({ queryKey: ["seasons", data.club_id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
