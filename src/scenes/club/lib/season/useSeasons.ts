import { useQuery } from "react-query";
import { getSeasonsByClubId } from "./season.repository";

export default function useSeasons(clubId: number) {
  return useQuery({
    queryKey: ["seasons", clubId],
    queryFn: () => getSeasonsByClubId(clubId),
    enabled: !!clubId,
  });
}
