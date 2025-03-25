import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { TablesInsert } from "types/supabase";
import { addMemberToCache } from "../club/club.service";
import { createMember } from "./member.repository";

export default function useCreateMember() {
  const { toast } = useToast();
  const mutationFn = (payload: TablesInsert<"club_member">) =>
    createMember(payload);
  const onError = (error: Error) => {
    toast({ description: error.message, variant: "destructive" });
  };
  return useMutation({ mutationFn, onSuccess: addMemberToCache, onError });
}
