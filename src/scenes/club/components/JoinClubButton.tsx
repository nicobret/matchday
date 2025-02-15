import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ClipboardSignature } from "lucide-react";
import { useContext } from "react";
import { useLocation } from "wouter";
import useCreateMember from "../lib/member/useCreateMember";

export default function JoinClubButton({ clubId }: { clubId: number }) {
  const { session } = useContext(SessionContext);
  const { mutate, isLoading } = useCreateMember(clubId);
  const [_location, navigate] = useLocation();

  function handleClick() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("~/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }
    mutate();
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      <ClipboardSignature className="mr-2 h-5 w-5" />
      Rejoindre
    </Button>
  );
}
