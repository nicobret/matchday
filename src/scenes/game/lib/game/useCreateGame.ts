import { SessionContext } from "@/components/auth-provider";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { createGame, createGamePayload } from "./game.service";

export default function useCreateGame(clubId: number) {
  const { session } = useContext(SessionContext);
  return useMutation({
    mutationFn: async (
      data: Omit<createGamePayload, "club_id" | "creator_id">,
    ) => {
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour créer un match");
      }
      const payload = {
        ...data,
        club_id: clubId,
        creator_id: session?.user.id,
      };
      return await createGame(payload);
    },
    onError: (e: Error) => {
      window.alert(e.message || "Une erreur s'est produite.");
      console.error(e);
    },
  });
}
