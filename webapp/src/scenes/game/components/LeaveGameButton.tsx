import { Button } from "@/components/ui/button";
import usePlayers from "@/lib/player/usePlayers";
import useUpdatePlayer from "@/lib/player/useUpdatePlayer";
import { Ban, Loader } from "lucide-react";

export default function LeaveGameButton({
  gameId,
  className = "",
}: {
  gameId: number;
  className?: string;
}) {
  const { myPlayer } = usePlayers(gameId);
  const { mutate, isPending } = useUpdatePlayer(myPlayer!);
  return (
    <Button
      onClick={() => mutate({ status: "cancelled" })}
      disabled={isPending}
      variant="outline"
      className={className}
    >
      {isPending ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Ban className="inline-block h-4 w-4" />
          Désinscription
        </>
      )}
    </Button>
  );
}
