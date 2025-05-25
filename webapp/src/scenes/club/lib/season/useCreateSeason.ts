import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { createSeason } from "./season.repository";

export default function useCreateSeason(clubId: number) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (name: string) => createSeason({ club_id: clubId, name }),
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "La saison a été créée." });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["seasons", clubId] }),
  });
}
