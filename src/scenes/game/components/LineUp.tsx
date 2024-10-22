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
import InviteDialog from "./LineupEditor/InviteDialog";

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
    <Card>
      <CardHeader>
        <CardTitle>Compos</CardTitle>
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
      <CardFooter>
        <InviteDialog gameId={game.id} disabled={disabled} />
      </CardFooter>
    </Card>
  );
}
