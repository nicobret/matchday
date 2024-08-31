import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Game, Player } from "../games.service";
import LineupEditor from "./LineupEditor";

export default function LineUp({
  game,
  players,
  setPlayers,
  disabled,
}: {
  game: Game;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  disabled: boolean;
}) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Composition</CardTitle>
      </CardHeader>
      <CardContent>
        <LineupEditor players={players} setPlayers={setPlayers} />
      </CardContent>
    </Card>
  );
}
