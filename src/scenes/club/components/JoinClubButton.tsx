import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import { ClipboardSignature } from "lucide-react";
import { useLocation } from "wouter";
import useCreateMember from "../lib/member/useCreateMember";

export default function JoinClubButton({ clubId }: { clubId: number }) {
  const { session } = useAuth();
  const { mutate, isPending } = useCreateMember();
  const [_location, navigate] = useLocation();

  function handleClick() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("~/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }
    mutate({ club_id: clubId, user_id: session.user.id });
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      <ClipboardSignature />
      Rejoindre
    </Button>
  );
}
