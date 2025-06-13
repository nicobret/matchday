import { useQuery } from "@tanstack/react-query";
import seasonService from "../../../../lib/seasonService";

export default function useSeasons(clubId: number) {
  return useQuery({
    queryKey: ["seasons", clubId],
    queryFn: () => seasonService.getByClubId(clubId),
    enabled: !!clubId,
  });
}
