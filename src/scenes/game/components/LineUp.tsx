import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Game } from "../lib/game/game.service";
import { Player } from "../lib/player/player.service";
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
          <p>
            {players.length} / {game.total_players} joueurs inscrits.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineupEditor players={players} disabled={disabled} />
      </CardContent>
      <CardFooter>
        <InviteDialog gameId={game.id} disabled={disabled} />
      </CardFooter>
    </Card>
  );
}
