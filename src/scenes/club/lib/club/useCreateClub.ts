import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { TablesInsert } from "types/supabase";
import { createClub } from "./club.repository";

export function useCreateClub() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: TablesInsert<"clubs">) => createClub(data),
    onSuccess: () => {
      toast({ description: "Club créé avec succès" });
    },
    onError: (error: Error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
}
