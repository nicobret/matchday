import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Player } from "../games.service";
import LineupEditor from "./LineupEditor";

export default function LineUp({
  players,
  setPlayers,
  disabled,
}: {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  disabled: boolean;
}) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">Equipes</CardTitle>
      </CardHeader>
      <CardContent>
        {disabled ? (
          <div className="text-center">
            <p>La composition ne peut pas être modifiée.</p>
          </div>
        ) : (
          <LineupEditor players={players} setPlayers={setPlayers} />
        )}
      </CardContent>
    </Card>
  );
}
