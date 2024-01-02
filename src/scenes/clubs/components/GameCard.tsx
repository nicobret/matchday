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
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";

export default function GameCard({ game }: { game: gameSummary }) {
  return (
    <Card className="bg-accent">
      <CardHeader>
        <CardTitle>
          <Link
            to={"/games/" + game.id.toString()}
            className="hover:underline underline-offset-2 decoration-2"
          >
            Match #{game.id}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm pb-0">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4" />
          <p className="col-span-5">
            {new Date(game.date).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4" />
          <p className="col-span-5">IND</p>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-4 h-4" />
          <p className="col-span-5">{game.player_count[0].count} / 10</p>
          <Badge>{game.status}</Badge>
        </div>
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
