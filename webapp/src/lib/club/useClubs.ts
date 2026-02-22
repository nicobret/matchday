import { useQuery } from "@tanstack/react-query";
import { getClubs } from "./club.repository";
import type { Club } from "./club.service";

export default function useClubs(userId?: string) {
  return useQuery<Club[]>({
    queryKey: ["clubs", userId ?? null],
    queryFn: () => getClubs({ userId }),
    // When a userId is provided, ensure the query runs (enabled is true); otherwise default to true
    enabled: userId === undefined ? true : Boolean(userId),
  });
}
