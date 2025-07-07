import { useToast } from "@/hooks/use-toast";
import { createSeason } from "@/lib/season/seasonService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateSeason(clubId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
