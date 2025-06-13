import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import seasonService from "../../../../lib/seasonService";

export default function useCreateSeason(clubId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      seasonService.create({ club_id: clubId, name }),
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
