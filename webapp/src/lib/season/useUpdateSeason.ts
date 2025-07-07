import { useToast } from "@/hooks/use-toast";
import { updateSeason } from "@/lib/season/seasonService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateSeason() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSeason,
    onSuccess: (data) => {
      toast({ title: "Succès", description: "La saison a été modifiée." });
      queryClient.invalidateQueries({ queryKey: ["seasons", data.club_id] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
