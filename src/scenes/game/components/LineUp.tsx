import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Game } from "../lib/game.service";
import { Player } from "../lib/player.service";
import LineupEditor from "./LineupEditor";

export default function LineUp({
  game,
  players,
  disabled,
}: {
  game: Game;
  players: Player[];
  disabled: boolean;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Equipes</CardTitle>
        <CardDescription>
          Prépare les compos de manière collaborative, en temps réel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-6">
          {players.length} / {game.total_players} joueurs inscrits.
        </p>
        <LineupEditor players={players} disabled={disabled} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
