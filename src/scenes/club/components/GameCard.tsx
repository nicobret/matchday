import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle, Hourglass, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Game } from "../lib/club.service";

export default function GameCard({ game }: { game: Game }) {
  const count = game.players.filter((e) => e.status === "confirmed").length;
  const isFull = count >= (game.total_players || 10);

  return (
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle className="capitalize">
          {new Date(game.date).toLocaleDateString("fr-FR", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-around gap-4">
        <Users className="h-6 w-6" />
        <p className="text-2xl">
          {count} / {game.total_players || 10}
        </p>
        {isFull ? (
          <CheckCircle className="h-6 w-6 text-primary" />
        ) : (
          <Hourglass className="h-6 w-6 text-muted-foreground" />
        )}
      </CardContent>

      <CardFooter>
        <Link
          to={"/game/" + game.id.toString()}
          className={`${buttonVariants()} w-full`}
        >
          Voir
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
