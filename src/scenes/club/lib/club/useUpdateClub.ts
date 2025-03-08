import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { TablesUpdate } from "types/supabase";
import { updateClub } from "./club.repository";

export default function useUpdateClub(clubId: number) {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: TablesUpdate<"clubs">) =>
      updateClub({ ...data, id: clubId }),
    onSuccess: () => {
      toast({ description: "Club modifié avec succès" });
    },
    onError: (error: Error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
}
