import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { createSeason } from "./season.repository";

export default function useCreateSeason(clubId: number) {
  return useMutation({
    mutationFn: (name: string) => createSeason(clubId, name),
    onSettled: () => queryClient.invalidateQueries(["seasons", clubId]),
  });
}
