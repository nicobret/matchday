import { queryClient } from "@/lib/react-query";
import { useMutation } from "react-query";
import { createPlayer } from "./player.service";

export default function useCreatePlayer(gameId: number) {
  return useMutation({
    mutationFn: async ({
      user_id,
      name,
    }: {
      user_id?: string;
      name?: string;
    }) => await createPlayer(gameId, user_id, name),
    onSuccess: () => queryClient.invalidateQueries(["players", gameId]),
  });
}
