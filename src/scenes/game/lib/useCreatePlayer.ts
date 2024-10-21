import { useMutation } from "react-query";
import { createPlayer, updateCache } from "./player.service";

export default function useCreatePlayer(gameId: number) {
  return useMutation({
    mutationFn: ({ user_id, name }: { user_id?: string; name?: string }) =>
      createPlayer(gameId, user_id, name),
    onSuccess: (data) => {
      if (data) updateCache(data);
    },
  });
}
