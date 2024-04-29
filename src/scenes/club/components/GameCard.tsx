import { Link } from "react-router-dom";
import { gameSummary } from "@/scenes/game/games.service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle, Hourglass, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function GameCard({ game }: { game: gameSummary }) {
  const count = game.game_registrations.filter(
    (e) => e.status === "confirmed"
  ).length;
  const isFull = count >= game.total_players;

  return (
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle className="hover:underline underline-offset-4 decoration-2 text-primary capitalize">
          <Link to={"/game/" + game.id.toString()}>
            {new Date(game.date).toLocaleDateString("fr-FR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex gap-4 items-center justify-around">
        <Users className="w-6 h-6" />
        <p className="text-2xl">
          {count} / {game.total_players || 10}
        </p>
        {isFull ? (
          <CheckCircle className="w-6 h-6 text-primary" />
        ) : (
          <Hourglass className="w-6 h-6 text-muted-foreground" />
        )}
      </CardContent>

      <CardFooter>
        <Link
          to={"/game/" + game.id.toString()}
          className={`${buttonVariants()} w-full`}
        >
          Voir
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </CardFooter>
    </Card>
  );
}
