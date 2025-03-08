import { useToast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import { deleteClub } from "./club.repository";

export default function useDeleteClub(clubId: number) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: () => deleteClub(clubId),
    onSuccess: () => {
      toast({ description: "Club supprimé avec succès" });
    },
    onError: (error: Error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
}
