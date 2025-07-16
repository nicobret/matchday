import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Game } from "@/lib/club/club.service";
import usePlayers from "@/lib/player/usePlayers";
import JoinGameButton from "@/scenes/game/components/JoinGameButton";
import LeaveGameButton from "@/scenes/game/components/LeaveGameButton";
import { CheckCircle, Eye, Hourglass, Users } from "lucide-react";
import { Link } from "wouter";

export default function GameCard({ game }: { game: Game }) {
  const count = game.players.filter((e) => e.status === "confirmed").length;
  const isFull = count >= (game.total_players || 10);
  const { isPlayer } = usePlayers(game.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1 capitalize">
          <Link to={"~/game/" + game.id.toString()}>
            {new Date(game.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-around gap-4">
        <Users className="h-6 w-6" />
        <p className="text-2xl">
          {count} / {game.total_players || 10}
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
        <Link
          to={"~/game/" + game.id.toString()}
          className={`${buttonVariants({ variant: "secondary" })} w-full`}
        >
          <Eye className="h-5 w-5" />
          Voir
        </Link>
      </CardFooter>
    </Card>
  );
}
