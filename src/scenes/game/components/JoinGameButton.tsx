import { Button } from "@/components/ui/button";
import useAuth from "@/lib/useAuth";
import useCreatePlayer from "@/scenes/game/lib/player/useCreatePlayer";
import { ClipboardSignature, Loader } from "lucide-react";
import { useLocation } from "wouter";
import { Game } from "../../club/lib/club/club.service";
import useCreateMember from "../../club/lib/member/useCreateMember";
import { useMembers } from "../../club/lib/member/useMembers";
import usePlayers from "../lib/player/usePlayers";

export default function JoinGameButton({
  game,
  className = "",
}: {
  game: Game;
  className?: string;
}) {
  const { session } = useAuth();
  const { mutate: createPlayer, isPending } = useCreatePlayer(game.id);
  const [_location, navigate] = useLocation();
  const { isMember } = useMembers(game.club_id);
  const { mutate: createMember } = useCreateMember();
  const { isInvited } = usePlayers(game.id);

  function handleClick() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("~/auth/login?redirectTo=" + window.location.pathname);
      }
      return;
    }
    if (!isMember) {
      if (
        window.confirm(
          "Vous n'êtes pas membre du club organisateur, souhaitez-vous le rejoindre ?",
        )
      ) {
        createMember({ club_id: game.club_id, user_id: session.user.id });
      } else {
        return;
      }
    }
    createPlayer({ user_id: session.user.id });
  }

  return (
    <Button onClick={handleClick} disabled={isPending} className={className}>
      {isPending ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <ClipboardSignature className="inline-block h-4 w-4" />
          {isInvited ? "Accepter" : "Inscription"}
        </>
      )}
    </Button>
  );
}
