import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { useQuery } from "react-query";
import { getClub } from "./club.repository";

export default function useClub(id?: number) {
  if (!id) {
    throw new Error("id is required");
  }
  const { session } = useContext(SessionContext);
  const res = useQuery({
    queryKey: ["club", id],
    queryFn: () => getClub(id),
    enabled: !!id,
  });
  const isAdmin =
    res.data?.members.some(
      (m) => m.user_id === session?.user.id && m.role === "admin",
    ) || false;
  return { ...res, isAdmin };
}
