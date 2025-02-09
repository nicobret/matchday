import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { useContext } from "react";
import useDeleteMember from "../lib/member/useDeleteMember";

export default function LeaveButton({ clubId }: { clubId: number }) {
  const { session } = useContext(SessionContext);
  const { mutate, isLoading } = useDeleteMember(clubId);

  function handleClick() {
    if (!session?.user) {
      throw new Error("Vous n'êtes pas connecté.");
    }
    if (window.confirm("Voulez-vous vraiment quitter ce club ?")) {
      mutate();
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading} variant="secondary">
      <Ban className="mr-2 inline-block h-5 w-5" />
      Quitter
    </Button>
  );
}
