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
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Link
            to={"/games/" + game.id.toString()}
            className="hover:underline underline-offset-2 decoration-2"
          >
            {new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </Link>
          <div>
            <Badge variant="outline">{game.status}</Badge>
          </div>
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
          className="p-1 rounded text-right ml-auto text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
