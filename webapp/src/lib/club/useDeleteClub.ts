import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteClub } from "./club.repository";

export default function useDeleteClub(clubId: number) {
  return useMutation({
    mutationFn: () => deleteClub(clubId),
    onSuccess: () => {
      toast.success("Club supprimé avec succès");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
