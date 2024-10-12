import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import { useMutation } from "react-query";
import { Tables } from "types/supabase";

export default function useMutateGame() {
  return useMutation({
    mutationFn: async (newGame: Tables<"games">) => {
      return await updateGame(newGame);
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: ["game", data.id] });
      }
    },
    onError: (error: Error) => {
      window.alert("Une erreur s'est produite.");
      console.error(error);
    },
  });
}

async function updateGame(game: Partial<Tables<"games">>) {
  const { data } = await supabase
    .from("games")
    .update(game)
    .eq("id", Number(game.id))
    .select("*")
    .single()
    .throwOnError();
  return data;
}
