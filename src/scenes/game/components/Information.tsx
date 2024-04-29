import { Tables } from "types/supabase";
import { clubType } from "../View";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clipboard,
  ClipboardSignature,
  Clock,
  MapPin,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Information({
  game,
  clubs,
}: {
  game: Tables<"games">;
  clubs: clubType[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <Clipboard className="h-5 w-5 flex-none" />
          Informations
          <Button asChild variant="link" className="gap-2 ml-auto h-auto p-0">
            <Link to={`/game/${game.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-3 items-center">
          <ClipboardSignature className="h-4 w-4" />
          {clubs[0].name}
          {game.opponent_id ? " vs " + clubs[1].name : ""}
        </div>

        <div className="flex gap-3 items-center">
          <Calendar className="h-4 w-4" />
          {new Date(game.date).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
        </div>

        <div className="flex gap-3 items-center">
          <Clock className="h-4 w-4" />
          {new Date(game.date).toLocaleTimeString("fr-FR", {
            timeStyle: "short",
          })}
        </div>

        <div className="flex gap-3 items-center">
          <MapPin className="h-4 w-4 flex-none" />
          {game.location}
        </div>
      </CardContent>
    </Card>
  );
}
