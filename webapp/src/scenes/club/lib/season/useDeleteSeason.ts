import { useMutation, useQueryClient } from "@tanstack/react-query";
import seasonService from "../../../../lib/seasonService";

export default function useDeleteSeason() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seasonService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  });
}
