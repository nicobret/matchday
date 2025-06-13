import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import seasonService from "../../../../lib/seasonService";

export default function useUpdateSeason() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: seasonService.update,
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
