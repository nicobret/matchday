import { deleteSeasonById } from "@/lib/season/seasonService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSeasonById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  });
}
