import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/lib/auth/useAuth";
import { Game } from "@/lib/game/gameService";
import JoinGameButton from "@/scenes/game/components/JoinGameButton";
import LeaveGameButton from "@/scenes/game/components/LeaveGameButton";
import { ArrowRight, CheckCircle, Hourglass, Users } from "lucide-react";
import { Link } from "wouter";

export default function GameCard({ game }: { game: Game }) {
  const { session } = useAuth();
  const playerCount =
    game.players?.filter((e) => e.status === "confirmed").length || 0;
  const isFull = playerCount >= (game.total_players || 10);
  const isPlayer = game.players?.some(
    (player) =>
      player.user_id === session?.user.id && player.status === "confirmed",
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <Link to={"~/game/" + game.id.toString()}>
          <CardTitle className="flex justify-between">
            <p className="line-clamp-1 capitalize">
              {new Date(game.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
            <ArrowRight />
          </CardTitle>
        </Link>
        <p className="line-clamp-1">{game.club?.name}</p>
      </CardHeader>

      <CardContent className="flex items-center justify-around gap-4">
        <Users className="h-6 w-6" />
        <p className="text-2xl">
          {playerCount} / {game.total_players || 10}
        </p>
        {isFull ? (
          <CheckCircle className="text-primary h-6 w-6" />
        ) : (
          <Hourglass className="text-muted-foreground h-6 w-6" />
        )}
      </CardContent>

      <CardFooter className="grid gap-2">
        {isPlayer ? (
          <LeaveGameButton gameId={game.id} />
        ) : (
          <JoinGameButton game={game} className="w-full" />
        )}
      </CardFooter>
    </Card>
  );
}
