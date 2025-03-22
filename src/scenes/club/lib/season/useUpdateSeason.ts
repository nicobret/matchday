import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { updateSeason } from "./season.repository";

export default function useUpdateSeason() {
  const { toast } = useToast();
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
