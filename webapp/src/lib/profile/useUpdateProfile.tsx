import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TablesUpdate } from "shared/types/supabase";
import { toast } from "sonner";
import { updateProfile } from "./profileService";

export default function useUpdateProfile(userId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: TablesUpdate<"users">) =>
      updateProfile({ userId, payload }),
    onSuccess: (updatedProfile) => {
      client.setQueryData(["profile", userId], updatedProfile);
      toast.success("Profil mis à jour");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du profil");
    },
  });
}
