import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass, Users } from "lucide-react";
import PlayersTable from "./PlayersTable";
import { Tables } from "types/supabase";
import { gamePlayer } from "../View";

export default function Players({
  game,
  players,
}: {
  game: Tables<"games">;
  players: gamePlayer[];
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <Users className="h-5 w-5" />
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
