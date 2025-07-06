import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useClubCache } from "../club/club.service";
import { createMember } from "./member.repository";

export default function useCreateMember() {
  const { toast } = useToast();
  const { addMemberToCache } = useClubCache();
  const onError = (error: Error) => {
    toast({ description: error.message, variant: "destructive" });
  };
  return useMutation({
    mutationFn: createMember,
    onSuccess: addMemberToCache,
    onError,
  });
}
