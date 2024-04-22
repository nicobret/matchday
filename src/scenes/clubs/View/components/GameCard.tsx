import { Link } from "react-router-dom";
import { gameSummary } from "@/scenes/games/games.service";
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
        <CardTitle>
          <Link
            to={"/games/" + game.id.toString()}
            className="hover:underline underline-offset-4 decoration-2"
          >
            {new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex gap-4 items-center">
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

      <CardFooter className="flex justify-end gap-2">
        <Link
          to={"/games/" + game.id.toString()}
          className={`${buttonVariants()} w-full`}
        >
          Voir
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </CardFooter>
    </Card>
  );
}
