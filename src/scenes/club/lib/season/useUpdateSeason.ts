import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { updateSeason } from "./season.repository";

export default function useUpdateSeason() {
  return useMutation({
    mutationFn: updateSeason,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seasons"] }),
  });
}
