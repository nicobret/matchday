import { useQuery } from "react-query";
import { fetchMembers } from "./club.service";

export function useMembers(clubId: number) {
  return useQuery({
    queryKey: ["members", clubId],
    queryFn: () => fetchMembers(clubId),
  });
}
