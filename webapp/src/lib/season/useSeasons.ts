import { getSeasonsByClubId } from "@/lib/season/seasonService";
import { useQuery } from "@tanstack/react-query";

export default function useSeasons(clubId: number) {
  return useQuery({
    queryKey: ["seasons", clubId],
    queryFn: () => getSeasonsByClubId(clubId),
    enabled: !!clubId,
  });
}
