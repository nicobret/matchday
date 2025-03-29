import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { useContext } from "react";
import useDeleteMember from "../lib/member/useDeleteMember";

export default function LeaveClubButton({ clubId }: { clubId: number }) {
  const { session } = useContext(SessionContext);
  const { mutate, isPending } = useDeleteMember(clubId);

  function handleClick() {
    if (!session?.user) {
      throw new Error("Vous n'êtes pas connecté.");
    }
    if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
      mutate();
    }
  }

  return (
    <Button onClick={handleClick} disabled={isPending} variant="outline">
      <Ban />
      Quitter
    </Button>
  );
}
