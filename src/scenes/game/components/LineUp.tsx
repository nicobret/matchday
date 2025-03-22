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
import InviteExternalDialog from "./InviteExternalDialog";
import InviteMemberDialog from "./InviteMemberDialog";
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
    <Card>
      <CardHeader>
        <CardTitle>Compos</CardTitle>
        <CardDescription>
          {players.length} / {game.total_players} joueurs inscrits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineupEditor players={players} disabled={disabled} />
      </CardContent>
      <CardFooter className="flex gap-2">
        <InviteMemberDialog
          gameId={game.id}
          clubId={game.club_id}
          disabled={disabled}
        />
        <InviteExternalDialog gameId={game.id} disabled={disabled} />
      </CardFooter>
    </Card>
  );
}
