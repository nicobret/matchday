import { useQuery } from "@tanstack/react-query";
import { getClubs } from "./club.repository";

export default function useClubs() {
  return useQuery({ queryKey: ["clubs"], queryFn: getClubs });
}
