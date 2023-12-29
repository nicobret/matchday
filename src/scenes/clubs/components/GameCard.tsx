import { Link } from "react-router-dom";
import { gameSummary } from "@/scenes/games/games.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function GameCard({ game }: { game: gameSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Link
            to={"/games/" + game.id.toString()}
            className="hover:underline underline-offset-2"
          >
            {new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </Link>
          <Badge variant="outline">{game.status}</Badge>
        </CardTitle>
        <CardDescription>
          <p>{game.player_count[0].count} joueurs</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <p>{game.location}</p>
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Link
          to={"/games/" + game.id.toString()}
          className="text-right ml-auto"
        >
          <ArrowRight className="text-gray-300 w-5 h-5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
