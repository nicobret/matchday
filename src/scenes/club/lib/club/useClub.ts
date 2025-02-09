import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useQuery } from "react-query";
import { fetchClub } from "./club.service";

export default function useClub(id: number) {
  const { session } = useContext(SessionContext);
  const res = useQuery({
    queryKey: ["club", id],
    queryFn: () => fetchClub(id),
    enabled: !!id,
  });
  const isAdmin =
    res.data?.members.some(
      (m) => m.user_id === session?.user.id && m.role === "admin",
    ) || false;
  return { ...res, isAdmin };
}
