import { Button } from "@/components/ui/button";
import usePlayers from "@/lib/player/usePlayers";
import useUpdatePlayer from "@/lib/player/useUpdatePlayer";
import { Ban, Loader } from "lucide-react";

export default function LeaveGameButton({
  gameId,
  className = "",
  variant = "outline",
  size = "default",
  showIcon = true,
}: {
  gameId: number;
  className?: string;
  variant?:
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "default"
    | "destructive";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
}) {
  const { myPlayer } = usePlayers(gameId);
  const { mutate, isPending } = useUpdatePlayer(myPlayer!);
  return (
    <Button
      onClick={() => mutate({ status: "cancelled" })}
      disabled={isPending}
      variant={variant}
      size={size}
      className={className}
    >
      {isPending ? (
        <Loader className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {showIcon && <Ban className="inline-block h-4 w-4" />}
          Désinscription
        </>
      )}
    </Button>
  );
}
