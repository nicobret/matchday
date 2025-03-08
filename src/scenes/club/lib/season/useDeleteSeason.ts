import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { deleteSeason } from "./season.repository";

export default function useDeleteSeason() {
  return useMutation({
    mutationFn: deleteSeason,
    onSuccess: () => queryClient.invalidateQueries("seasons"),
  });
}
