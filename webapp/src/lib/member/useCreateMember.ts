import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useClubCache } from "../club/club.service";
import { createMember } from "./member.repository";

export default function useCreateMember() {
  const { addMemberToCache } = useClubCache();
  const onError = (error: Error) => {
    toast.error(error.message);
  };
  return useMutation({
    mutationFn: createMember,
    onSuccess: addMemberToCache,
    onError,
  });
}
