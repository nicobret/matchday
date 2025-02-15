import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import useCreatePlayer from "@/scenes/game/lib/player/useCreatePlayer";
import { ClipboardSignature, Loader } from "lucide-react";
import { useContext } from "react";
import { useLocation } from "wouter";
import { Game } from "../../club/lib/club/club.service";
import useCreateMember from "../../club/lib/member/useCreateMember";
import { useMembers } from "../../club/lib/member/useMembers";

export default function JoinGameButton({ game }: { game: Game }) {
  const { session } = useContext(SessionContext);
  const { mutate: createPlayer, isLoading } = useCreatePlayer(game.id);
  const [_location, navigate] = useLocation();
  const { isMember } = useMembers(game.club_id);
  const { mutate: createMember } = useCreateMember(game.club_id);

  function handleClick() {
    if (!session?.user) {
      if (window.confirm("Pour vous inscrire, veuillez vous connecter.")) {
        navigate("~/auth?redirectTo=" + window.location.pathname);
      }
      return;
    }
    if (!isMember) {
      if (
        window.confirm(
          "Vous n'êtes pas membre du club organisateur, souhaitez-vous le rejoindre ?",
        )
      ) {
        createMember();
      }
    }
    createPlayer({ user_id: session.user.id });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full md:w-fit"
    >
      {isLoading ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <ClipboardSignature className="mr-1 inline-block h-4 w-4" />
          <span>Inscription</span>
        </>
      )}
    </Button>
  );
}
