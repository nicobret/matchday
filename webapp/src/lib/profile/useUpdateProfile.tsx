import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { updateProfile } from "./profileService";

export default function useUpdateProfile(userId: string) {
  const { toast } = useToast();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: TablesUpdate<"users">) =>
      updateProfile({ userId, payload }),
    onSuccess: (updatedProfile) => {
      client.setQueryData(["profile", userId], updatedProfile);
      toast({ description: "Profil mis à jour" });
    },
    onError: (error) => {
      console.error(error);
      toast({ description: "Erreur lors de la mise à jour du profil" });
    },
  });
}
