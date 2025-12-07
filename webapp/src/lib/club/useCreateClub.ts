import { useMutation } from "@tanstack/react-query";
import { TablesInsert } from "shared/types/supabase";
import { toast } from "sonner";
import { createClub } from "./club.repository";

export function useCreateClub() {
  return useMutation({
    mutationFn: (data: TablesInsert<"clubs">) => createClub(data),
    onSuccess: () => {
      toast.success("Club créé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
