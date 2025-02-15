import { Button } from "@/components/ui/button";
import usePlayers from "@/scenes/game/lib/player/usePlayers";
import useUpdatePlayer from "@/scenes/game/lib/player/useUpdatePlayer";
import { Ban, Loader } from "lucide-react";

export default function LeaveGameButton({ gameId }: { gameId: number }) {
  const { myPlayer } = usePlayers(gameId);
  const { mutate, isLoading } = useUpdatePlayer(myPlayer!);
  return (
    <Button
      onClick={() => mutate({ status: "cancelled" })}
      disabled={isLoading}
      variant="secondary"
    >
      {isLoading ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Ban className="mr-2 inline-block h-4 w-4" />
          <span>Désinscription</span>
        </>
      )}
    </Button>
  );
}
