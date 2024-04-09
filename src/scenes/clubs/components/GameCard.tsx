import { Link } from "react-router-dom";
import { gameSummary } from "@/scenes/games/games.service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function GameCard({ game }: { game: gameSummary }) {
  const status = game.player_count[0].count === 10 ? "Complet" : "Incomplet";
  const variant = status === "Complet" ? "default" : "outline";

  return (
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle>
          <Link
            to={"/games/" + game.id.toString()}
            className="hover:underline underline-offset-2 decoration-2"
          >
            {new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4" />
          <p>IND</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Users className="w-4 h-4 flex-none" />
          <p>{game.player_count[0].count} / 10</p>
          <Badge variant={variant}>{status}</Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Link to={"/games/" + game.id.toString()} className={buttonVariants()}>
          Voir
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </CardFooter>
    </Card>
  );
}
