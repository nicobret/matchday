import { useQuery } from "react-query";
import { fetchClub } from "./club.service";

export default function useClub(id: number) {
  return useQuery({
    queryKey: ["club", id],
    queryFn: () => fetchClub(id),
    enabled: !!id,
  });
}
