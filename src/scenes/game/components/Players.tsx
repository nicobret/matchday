import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { Tables } from "types/supabase";
import { Player } from "../games.service";
import PlayersTable from "./PlayersTable";

export default function Players({
  game,
  players,
}: {
  game: Tables<"games">;
  players: Player[];
}) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          Joueurs
          <Badge variant="secondary" className="ml-auto gap-2">
            <Hourglass className="h-3 w-3" />
            {players.filter((p) => p.status === "confirmed").length} /{" "}
            {game.total_players}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlayersTable players={players} />
      </CardContent>
    </Card>
  );
}
