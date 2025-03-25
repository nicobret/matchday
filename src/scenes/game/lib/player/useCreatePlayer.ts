import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { createPlayer } from "./player.service";

export default function useCreatePlayer(gameId: number) {
  return useMutation({
    mutationFn: ({
      user_id,
      name,
      status,
    }: {
      user_id?: string;
      name?: string;
      status?: "confirmed" | "pending";
    }) => createPlayer(gameId, user_id, name, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["players", gameId] }),
  });
}
