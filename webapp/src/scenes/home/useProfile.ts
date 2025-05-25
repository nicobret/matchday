import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../account/account.service";

export default function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}
